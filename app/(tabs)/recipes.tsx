import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { usePantry } from "@/lib/pantry-context";
import RecipeCard from "@/components/RecipeCard";
import { getMatchingRecipes, CATEGORIES } from "@/lib/recipe-data";
import Colors from "@/constants/colors";

const C = Colors.light;

export default function RecipesScreen() {
  const insets = useSafeAreaInsets();
  const { pantryItems, toggleFavorite, isFavorite } = usePantry();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const recipes = useMemo(
    () => getMatchingRecipes(pantryItems, selectedCategory),
    [pantryItems, selectedCategory],
  );

  const hasIngredients = pantryItems.length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Recipes</Text>
        <Text style={styles.subtitle}>
          {hasIngredients
            ? `Matched to your ${pantryItems.length} ingredients`
            : "Add ingredients to find matches"}
        </Text>
      </View>

      <View style={styles.categoryRow}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {!hasIngredients ? (
        <View style={styles.emptyState}>
          <Feather name="shopping-bag" size={48} color={C.borderLight} />
          <Text style={styles.emptyTitle}>Your pantry is empty</Text>
          <Text style={styles.emptyText}>
            Head to the Pantry tab and add what you have on hand to see matching
            recipes here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          contentInsetAdjustmentBehavior="automatic"
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="search" size={48} color={C.borderLight} />
              <Text style={styles.emptyTitle}>No matches found</Text>
              <Text style={styles.emptyText}>
                Try adding more ingredients or selecting a different category.
              </Text>
            </View>
          }
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
    paddingBottom: 8,
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
  categoryRow: {
    paddingVertical: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.chipBg,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: C.primary,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: C.textSecondary,
  },
  categoryTextActive: {
    color: "#fff",
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
