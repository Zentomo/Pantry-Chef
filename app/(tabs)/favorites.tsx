import React, { useMemo } from "react";
import { StyleSheet, Text, View, FlatList, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { usePantry } from "@/lib/pantry-context";
import RecipeCard from "@/components/RecipeCard";
import { RECIPES } from "@/lib/recipe-data";
import Colors from "@/constants/colors";

const C = Colors.light;

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { favorites, pantryItems, toggleFavorite, isFavorite } = usePantry();

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const favoriteRecipes = useMemo(() => {
    const normalizedPantry = pantryItems.map((i) => i.toLowerCase());
    return RECIPES.filter((r) => favorites.includes(r.id)).map((recipe) => {
      const matchCount = recipe.ingredients.filter((ing) =>
        normalizedPantry.includes(ing.toLowerCase()),
      ).length;
      const matchPercent = Math.round(
        (matchCount / recipe.ingredients.length) * 100,
      );
      return { ...recipe, matchCount, matchPercent };
    });
  }, [favorites, pantryItems]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>
          {favorites.length === 0
            ? "Save recipes you love"
            : `${favorites.length} saved recipe${favorites.length !== 1 ? "s" : ""}`}
        </Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="heart" size={48} color={C.borderLight} />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>
            Tap the heart on any recipe to save it here for quick access.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteRecipes}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          contentInsetAdjustmentBehavior="automatic"
          renderItem={({ item }) => (
            <RecipeCard
              title={item.title}
              subtitle={item.subtitle}
              cookTime={item.cookTime}
              servings={item.servings}
              matchPercent={item.matchPercent}
              difficulty={item.difficulty}
              isFavorite={isFavorite(item.id)}
              onPress={() =>
                router.push({
                  pathname: "/recipe/[id]",
                  params: { id: item.id },
                })
              }
              onFavoritePress={() => toggleFavorite(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: "DMSans_700Bold",
    color: C.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    color: C.textSecondary,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "DMSans_700Bold",
    color: C.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: C.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
