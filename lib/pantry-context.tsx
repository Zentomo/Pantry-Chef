import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PantryContextValue {
  pantryItems: string[];
  favorites: string[];
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  isLoaded: boolean;
}

const PantryContext = createContext<PantryContextValue | null>(null);

const PANTRY_KEY = "@pantry_items";
const FAVORITES_KEY = "@favorite_recipes";

export function PantryProvider({ children }: { children: ReactNode }) {
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [storedPantry, storedFavs] = await Promise.all([
          AsyncStorage.getItem(PANTRY_KEY),
          AsyncStorage.getItem(FAVORITES_KEY),
        ]);
        if (storedPantry) setPantryItems(JSON.parse(storedPantry));
        if (storedFavs) setFavorites(JSON.parse(storedFavs));
      } catch (e) {
        console.error("Failed to load data:", e);
      }
      setIsLoaded(true);
    })();
  }, []);

  const addItem = (item: string) => {
    setPantryItems((prev) => {
      if (prev.includes(item)) return prev;
      const next = [...prev, item];
      AsyncStorage.setItem(PANTRY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeItem = (item: string) => {
    setPantryItems((prev) => {
      const next = prev.filter((i) => i !== item);
      AsyncStorage.setItem(PANTRY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (recipeId: string) => favorites.includes(recipeId);

  const value = useMemo(
    () => ({ pantryItems, favorites, addItem, removeItem, toggleFavorite, isFavorite, isLoaded }),
    [pantryItems, favorites, isLoaded],
  );

  return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>;
}

export function usePantry() {
  const ctx = useContext(PantryContext);
  if (!ctx) throw new Error("usePantry must be used within PantryProvider");
  return ctx;
}
