import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { usePantry } from "@/lib/pantry-context";
import { RECIPES } from "@/lib/recipe-data";
import Colors from "@/constants/colors";

const C = Colors.light;

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { pantryItems, toggleFavorite, isFavorite } = usePantry();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const recipe = RECIPES.find((r) => r.id === id);

  if (!recipe) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
        <Text style={styles.errorText}>Recipe not found</Text>
      </View>
    );
  }

  const normalizedPantry = pantryItems.map((i) => i.toLowerCase());
  const favorite = isFavorite(recipe.id);

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(recipe.id);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topBar,
          { paddingTop: insets.top + 8 + webTopInset },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={C.text} />
        </Pressable>
        <Pressable onPress={handleFavorite} hitSlop={12}>
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={26}
            color={favorite ? C.danger : C.text}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 56 + webTopInset,
            paddingBottom: insets.bottom + 40 + webBottomInset,
          },
        ]}
      >
        <View style={styles.titleSection}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{recipe.category}</Text>
          </View>
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.subtitle}>{recipe.subtitle}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaBox}>
              <Feather name="clock" size={18} color={C.primary} />
              <Text style={styles.metaValue}>{recipe.cookTime}</Text>
              <Text style={styles.metaLabel}>min</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaBox}>
              <Ionicons name="people-outline" size={18} color={C.primary} />
              <Text style={styles.metaValue}>{recipe.servings}</Text>
              <Text style={styles.metaLabel}>servings</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaBox}>
              <Feather name="bar-chart-2" size={18} color={C.primary} />
              <Text style={styles.metaValue}>{recipe.difficulty}</Text>
              <Text style={styles.metaLabel}>level</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ing, i) => {
            const inPantry = normalizedPantry.includes(ing.toLowerCase());
            return (
              <View key={i} style={styles.ingredientRow}>
                <View
                  style={[
                    styles.ingredientDot,
                    inPantry && styles.ingredientDotActive,
                  ]}
                >
                  {inPantry && (
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  )}
                </View>
                <Text
                  style={[
                    styles.ingredientText,
                    inPantry && styles.ingredientTextActive,
                  ]}
                >
                  {ing}
                </Text>
                {inPantry && (
                  <Text style={styles.inPantryLabel}>in pantry</Text>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Steps</Text>
          {recipe.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: C.background,
  },
  content: {
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    color: C.textSecondary,
    textAlign: "center",
    marginTop: 100,
  },
  titleSection: {
    marginBottom: 28,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: C.warm,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontFamily: "DMSans_700Bold",
    color: C.accent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontFamily: "DMSans_700Bold",
    color: C.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    color: C.textSecondary,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: "row",
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  metaBox: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  metaValue: {
    fontSize: 16,
    fontFamily: "DMSans_700Bold",
    color: C.text,
  },
  metaLabel: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: C.textTertiary,
  },
  metaDivider: {
    width: 1,
    backgroundColor: C.borderLight,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "DMSans_700Bold",
    color: C.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  ingredientDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.border,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  ingredientDotActive: {
    backgroundColor: C.success,
    borderColor: C.success,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    color: C.text,
  },
  ingredientTextActive: {
    color: C.primary,
  },
  inPantryLabel: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    color: C.success,
  },
  stepRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 13,
    fontFamily: "DMSans_700Bold",
    color: "#fff",
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    color: C.text,
    lineHeight: 22,
  },
});
