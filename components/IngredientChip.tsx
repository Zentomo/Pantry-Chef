import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

const C = Colors.light;

interface Props {
  label: string;
  selected?: boolean;
  onPress: () => void;
  showRemove?: boolean;
}

export default function IngredientChip({ label, selected, onPress, showRemove }: Props) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipActive,
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{label}</Text>
      {showRemove && selected && (
        <Ionicons name="close" size={14} color={C.chipActiveText} style={{ marginLeft: 2 }} />
      )}
      {!showRemove && !selected && (
        <Ionicons name="add" size={14} color={C.chipText} style={{ marginLeft: 2 }} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.chipBg,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: C.chipActive,
  },
  chipText: {
    fontSize: 14,
    color: C.chipText,
    fontFamily: "DMSans_500Medium",
  },
  chipTextActive: {
    color: C.chipActiveText,
  },
});
