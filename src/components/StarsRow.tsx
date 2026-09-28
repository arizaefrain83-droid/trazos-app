import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants/theme";

interface StarsRowProps {
  stars: number;
  max?: number;
  size?: number;
}

export function StarsRow({ stars, max = 3, size = 18 }: StarsRowProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: max }).map((_, i) => (
        <Text key={i} style={[styles.star, { fontSize: size }]}>
          {i < stars ? "⭐" : "☆"}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    color: COLORS.star,
  },
});
