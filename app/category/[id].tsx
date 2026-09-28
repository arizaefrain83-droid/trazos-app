import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useEffect } from "react";
import { CATEGORIES } from "../../src/data/categories";
import { useProgressStore } from "../../src/store/progressStore";
import { COLORS, FONTS, SPACING, RADIUS } from "../../src/constants/theme";
import { StarsRow } from "../../src/components/StarsRow";

const DIFFICULTY_COLORS: Record<string, string> = {
  "Básico": "#4CAF87",
  "Intermedio": "#FF7B54",
  "Avanzado": "#9B59B6",
};

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const levelProgress = useProgressStore((s) => s.levelProgress);

  const category = CATEGORIES.find((c) => c.id === id);

  useEffect(() => {
    if (category) {
      navigation.setOptions({ headerTitle: category.name });
    }
  }, [category]);

  if (!category) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.error}>Categoría no encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{category.emoji}</Text>
          <Text style={[styles.heroTitle, { color: category.color }]}>
            {category.name}
          </Text>
          <Text style={styles.heroSub}>
            {category.levels.length} niveles disponibles
          </Text>
        </View>

        <View style={styles.levelList}>
          {category.levels.map((level, idx) => {
            const prog = levelProgress[level.id];
            const completed = prog?.completed ?? false;
            const stars = prog?.stars ?? 0;
            const unlocked = idx === 0 || levelProgress[category.levels[idx - 1].id]?.completed;
            const diffColor = DIFFICULTY_COLORS[level.difficulty] ?? COLORS.primary;

            return (
              <TouchableOpacity
                key={level.id}
                style={[styles.levelCard, !unlocked && styles.levelCardLocked]}
                onPress={() => {
                  if (unlocked) router.push(`/lesson/${level.id}`);
                }}
                activeOpacity={unlocked ? 0.8 : 1}
              >
                <View style={[styles.levelIcon, { backgroundColor: unlocked ? category.color : COLORS.locked }]}>
                  <Text style={styles.levelIconText}>
                    {completed ? "✓" : unlocked ? `${idx + 1}` : "🔒"}
                  </Text>
                </View>

                <View style={styles.levelContent}>
                  <View style={styles.levelTopRow}>
                    <Text style={[styles.levelTitle, !unlocked && styles.textLocked]}>
                      {level.title}
                    </Text>
                    <View style={[styles.diffBadge, { backgroundColor: diffColor + "22", borderColor: diffColor }]}>
                      <Text style={[styles.diffText, { color: diffColor }]}>
                        {level.difficulty}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.levelBottomRow}>
                    <Text style={[styles.stepsText, !unlocked && styles.textLocked]}>
                      {level.steps.length} pasos
                    </Text>
                    {unlocked && <StarsRow stars={stars} size={16} />}
                    {!unlocked && (
                      <Text style={styles.lockedHint}>
                        Completa el nivel anterior
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Connector lines between levels */}
        <View style={styles.mapHint}>
          <Text style={styles.mapHintText}>
            🗝️ Completa cada nivel para desbloquear el siguiente
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: SPACING.xxl },
  error: {
    padding: SPACING.lg,
    color: COLORS.text,
    fontSize: FONTS.sizes.lg,
  },
  hero: {
    alignItems: "center",
    padding: SPACING.xl,
    paddingTop: SPACING.md,
  },
  heroEmoji: { fontSize: 64, marginBottom: SPACING.sm },
  heroTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.heavy,
  },
  heroSub: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    marginTop: 4,
  },
  levelList: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  levelCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
    gap: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  levelCardLocked: {
    opacity: 0.6,
    backgroundColor: COLORS.lockedBg,
    shadowOpacity: 0,
    elevation: 0,
  },
  levelIcon: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  levelIconText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.heavy,
    color: COLORS.white,
  },
  levelContent: { flex: 1 },
  levelTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  levelTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  diffBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  diffText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  levelBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepsText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
  },
  textLocked: { color: COLORS.textMuted },
  lockedHint: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontStyle: "italic",
  },
  mapHint: {
    margin: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  mapHintText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    textAlign: "center",
  },
});
