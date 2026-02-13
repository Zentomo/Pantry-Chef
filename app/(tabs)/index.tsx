import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Platform,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { usePantry } from "@/lib/pantry-context";
import IngredientChip from "@/components/IngredientChip";
import { COMMON_INGREDIENTS } from "@/lib/recipe-data";
import Colors from "@/constants/colors";

const C = Colors.light;

export default function PantryScreen() {
  const insets = useSafeAreaInsets();
  const { pantryItems, addItem, removeItem } = usePantry();
  const [search, setSearch] = useState("");

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const filtered = useMemo(() => {
    if (!search.trim()) return COMMON_INGREDIENTS;
    return COMMON_INGREDIENTS.filter((i) =>
      i.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const isCustom =
    search.trim().length > 0 &&
    !COMMON_INGREDIENTS.some(
      (i) => i.toLowerCase() === search.trim().toLowerCase(),
    );

  const handleAddCustom = () => {
    const trimmed = search.trim();
    if (trimmed) {
      addItem(trimmed);
      setSearch("");
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.headerSection}>
        <Text style={styles.greeting}>My Pantry</Text>
        <Text style={styles.subGreeting}>
          {pantryItems.length === 0
            ? "Add what you have on hand"
            : `${pantryItems.length} ingredient${pantryItems.length !== 1 ? "s" : ""} ready`}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color={C.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search or add ingredient..."
          placeholderTextColor={C.textTertiary}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleAddCustom}
          returnKeyType="done"
        />
        {search.length > 0 && (
          <Feather
            name="x"
            size={18}
            color={C.textTertiary}
            onPress={() => setSearch("")}
          />
        )}
      </View>

      {pantryItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>In your pantry</Text>
          <View style={styles.chipWrap}>
            {pantryItems.map((item) => (
              <IngredientChip
                key={item}
                label={item}
                selected
                showRemove
                onPress={() => removeItem(item)}
              />
            ))}
          </View>
        </View>
      )}

      <View style={[styles.section, { flex: 1 }]}>
        <Text style={styles.sectionTitle}>
          {search.trim() ? "Results" : "Common ingredients"}
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chipWrap}
          contentInsetAdjustmentBehavior="automatic"
        >
          {isCustom && (
            <IngredientChip
              label={`Add "${search.trim()}"`}
              selected={false}
              onPress={handleAddCustom}
            />
          )}
          {filtered.map((item) => (
            <IngredientChip
              key={item}
              label={item}
              selected={pantryItems.includes(item)}
              showRemove={pantryItems.includes(item)}
              onPress={() =>
                pantryItems.includes(item) ? removeItem(item) : addItem(item)
              }
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
    paddingHorizontal: 20,
  },
  headerSection: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontFamily: "DMSans_700Bold",
    color: C.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    color: C.textSecondary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    color: C.text,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "DMSans_700Bold",
    color: C.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 100,
  },
});
