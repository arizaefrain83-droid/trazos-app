import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { CATEGORIES } from "../../src/data/categories";
import { useProgressStore } from "../../src/store/progressStore";
import { COLORS, FONTS, SPACING, RADIUS } from "../../src/constants/theme";
import { Category } from "../../src/data/types";

export default function CategoriesScreen() {
  const router = useRouter();
  const levelProgress = useProgressStore((s) => s.levelProgress);

  function getCompletedCount(category: Category) {
    return category.levels.filter((l) => levelProgress[l.id]?.completed).length;
  }

  function getTotalStars(category: Category) {
    return category.levels.reduce((acc, l) => acc + (levelProgress[l.id]?.stars ?? 0), 0);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trazos</Text>
        <Text style={styles.headerSub}>¡Aprende a dibujar!</Text>
      </View>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const completed = getCompletedCount(item);
          const total = item.levels.length;
          const stars = getTotalStars(item);
          const maxStars = total * 3;
          const progress = total > 0 ? completed / total : 0;

          return (
            <TouchableOpacity
              style={[styles.card, { borderTopColor: item.color }]}
              onPress={() => router.push(`/category/${item.id}`)}
              activeOpacity={0.8}
            >
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
              <Text style={styles.cardName}>{item.name}</Text>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progress * 100}%` as any, backgroundColor: item.color },
                  ]}
                />
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.cardSub}>
                  {completed}/{total} niveles
                </Text>
                <Text style={styles.cardStars}>
                  ⭐ {stars}/{maxStars}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: Platform.OS === "android" ? SPACING.xl : SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.sizes.huge,
    fontWeight: FONTS.weights.heavy,
    color: COLORS.primary,
    letterSpacing: -1,
  },
  headerSub: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    marginTop: 2,
  },
  grid: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  row: {
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderTopWidth: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardEmoji: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  cardName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: "hidden",
    marginBottom: SPACING.sm,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: RADIUS.full,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSub: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
  },
  cardStars: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
  },
});
