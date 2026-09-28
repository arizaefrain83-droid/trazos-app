import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";

const STEP_EMOJIS: Record<string, string> = {
  cat_step1: "⭕",
  cat_step2: "△",
  cat_step3: "😺",
  cat_step4: "🐱",
  elephant_step1: "🔵",
  elephant_step2: "🐘",
  elephant_step3: "🦵",
  elephant_step4: "🐘",
  tree_step1: "▬",
  tree_step2: "🌲",
  tree_step3: "🎄",
  tree_step4: "🌳",
  flower_step1: "⭕",
  flower_step2: "🌸",
  flower_step3: "🌹",
  flower_step4: "💐",
  house_step1: "⬛",
  house_step2: "🏠",
  house_step3: "🚪",
  house_step4: "🏡",
  rocket_step1: "▬",
  rocket_step2: "🚀",
  rocket_step3: "✈️",
  rocket_step4: "🚀",
  face_step1: "⭕",
  face_step2: "👀",
  face_step3: "🙂",
  face_step4: "😊",
  hero_step1: "👤",
  hero_step2: "🦸",
  hero_step3: "🦸",
  hero_step4: "🦸‍♂️",
};

interface PlaceholderImageProps {
  imageKey: string;
  size?: number;
  bgColor?: string;
}

export function PlaceholderImage({ imageKey, size = 200, bgColor = "#F0F0F0" }: PlaceholderImageProps) {
  const emoji = STEP_EMOJIS[imageKey] ?? "🎨";
  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, backgroundColor: bgColor, borderRadius: RADIUS.lg },
      ]}
    >
      <Text style={[styles.emoji, { fontSize: size * 0.35 }]}>{emoji}</Text>
      <Text style={styles.label}>Referencia</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
  },
  emoji: {
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
});
