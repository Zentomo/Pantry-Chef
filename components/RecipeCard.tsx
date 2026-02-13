import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

const C = Colors.light;

interface Props {
  title: string;
  subtitle: string;
  cookTime: number;
  servings: number;
  matchPercent: number;
  difficulty: string;
  isFavorite: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
}

export default function RecipeCard({
  title,
  subtitle,
  cookTime,
  servings,
  matchPercent,
  difficulty,
  isFavorite,
  onPress,
  onFavoritePress,
}: Props) {
  const handleFav = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onFavoritePress();
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.98 }] }]}
    >
      <View style={styles.header}>
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{matchPercent}%</Text>
        </View>
        <Pressable onPress={handleFav} hitSlop={12}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={22}
            color={isFavorite ? C.danger : C.textTertiary}
          />
        </Pressable>
      </View>

      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Feather name="clock" size={13} color={C.textTertiary} />
          <Text style={styles.metaText}>{cookTime} min</Text>
        </View>
        <View style={styles.dot} />
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={13} color={C.textTertiary} />
          <Text style={styles.metaText}>{servings}</Text>
        </View>
        <View style={styles.dot} />
        <Text style={styles.metaText}>{difficulty}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  matchBadge: {
    backgroundColor: C.warm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    fontSize: 12,
    fontFamily: "DMSans_700Bold",
    color: C.accent,
  },
  title: {
    fontSize: 18,
    fontFamily: "DMSans_700Bold",
    color: C.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: C.textSecondary,
    marginBottom: 12,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    color: C.textTertiary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.textTertiary,
    marginHorizontal: 8,
  },
});
