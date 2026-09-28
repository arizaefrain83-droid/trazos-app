import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { useProgressStore } from "../../src/store/progressStore";
import { CATEGORIES } from "../../src/data/categories";
import { COLORS, FONTS, SPACING, RADIUS } from "../../src/constants/theme";
import { StarsRow } from "../../src/components/StarsRow";

export default function ProgressScreen() {
  const levelProgress = useProgressStore((s) => s.levelProgress);

  const totalLevels = CATEGORIES.reduce((a, c) => a + c.levels.length, 0);
  const completedLevels = Object.values(levelProgress).filter((p) => p.completed).length;
  const totalStars = Object.values(levelProgress).reduce((a, p) => a + p.stars, 0);
  const maxStars = totalLevels * 3;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Progreso</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{completedLevels}</Text>
            <Text style={styles.summaryLabel}>Niveles{"\n"}completados</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{totalStars}</Text>
            <Text style={styles.summaryLabel}>Estrellas{"\n"}ganadas</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0}%
            </Text>
            <Text style={styles.summaryLabel}>Del total{"\n"}completado</Text>
          </View>
        </View>

        {CATEGORIES.map((category) => {
          const catCompleted = category.levels.filter(
            (l) => levelProgress[l.id]?.completed
          ).length;

          return (
            <View key={category.id} style={styles.categorySection}>
              <View style={styles.categorySectionHeader}>
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={[styles.categoryName, { color: category.color }]}>
                  {category.name}
                </Text>
                <Text style={styles.categoryCount}>
                  {catCompleted}/{category.levels.length}
                </Text>
              </View>

              {category.levels.map((level, idx) => {
                const prog = levelProgress[level.id];
                const completed = prog?.completed ?? false;
                const stars = prog?.stars ?? 0;
                const unlocked =
                  idx === 0 || levelProgress[category.levels[idx - 1].id]?.completed;

                return (
                  <View
                    key={level.id}
                    style={[styles.levelRow, !unlocked && styles.levelRowLocked]}
                  >
                    <View
                      style={[
                        styles.levelBadge,
                        { backgroundColor: completed ? category.color : COLORS.lockedBg },
                      ]}
                    >
                      <Text style={styles.levelBadgeText}>
                        {completed ? "✓" : unlocked ? `${idx + 1}` : "🔒"}
                      </Text>
                    </View>
                    <View style={styles.levelInfo}>
                      <Text style={[styles.levelTitle, !unlocked && styles.textLocked]}>
                        {level.title}
                      </Text>
                      <Text style={[styles.levelDifficulty, !unlocked && styles.textLocked]}>
                        {level.difficulty}
                      </Text>
                    </View>
                    <StarsRow stars={stars} size={14} />
                  </View>
                );
              })}
            </View>
          );
        })}

        {completedLevels === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🖌️</Text>
            <Text style={styles.emptyText}>
              Aún no has completado ningún nivel.{"\n"}¡Empieza dibujando!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: SPACING.xxl },
  header: {
    paddingTop: Platform.OS === "android" ? SPACING.xl : SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.heavy,
    color: COLORS.text,
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.heavy,
    color: COLORS.primary,
  },
  summaryLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 16,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
  categorySection: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categorySectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  categoryEmoji: { fontSize: 22 },
  categoryName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    flex: 1,
  },
  categoryCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  levelRowLocked: { opacity: 0.5 },
  levelBadge: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  levelBadgeText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
  levelInfo: { flex: 1 },
  levelTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
  levelDifficulty: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
  },
  textLocked: { color: COLORS.textMuted },
  emptyState: {
    alignItems: "center",
    padding: SPACING.xxl,
  },
  emptyEmoji: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 24,
  },
});
