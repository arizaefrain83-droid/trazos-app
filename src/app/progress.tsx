import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COURSES } from "../data/courses";
import { useAppStore } from "../store/appStore";
import { courseDoneCount, isDone, totalStars } from "../logic/progress";
import { COLORS, RADIUS, SHADOW, SPACING } from "../constants/theme";
import { Txt } from "../components/Txt";
import { StarsRow } from "../components/StarsRow";
import { ProgressBar } from "../components/ProgressBar";

export default function ProgressScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const progress = useAppStore((s) => s.progress);
  const journalCount = useAppStore((s) => s.journal.length);

  const totalLessons = COURSES.reduce((a, c) => a + c.lessons.length, 0);
  const done = COURSES.reduce((a, c) => a + courseDoneCount(c, progress), 0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingTop: insets.top + SPACING.sm, paddingBottom: insets.bottom + SPACING.xxl }}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={28} color={COLORS.ink} />
        </Pressable>
        <Txt variant="title">Mi progreso</Txt>
      </View>

      <View style={styles.stats}>
        <Stat icon="checkmark-circle" color={COLORS.success} value={`${done}/${totalLessons}`} label="Lecciones" />
        <Stat icon="star" color={COLORS.star} value={String(totalStars(progress))} label="Estrellas" />
        <Stat icon="book" color={COLORS.primary} value={String(journalCount)} label="Dibujos" />
      </View>

      {COURSES.map((c) => (
        <View key={c.id} style={styles.card}>
          <View style={styles.cardHead}>
            <Txt variant="heading" style={{ flex: 1, color: c.color }}>{c.name}</Txt>
            <Txt variant="caption">{courseDoneCount(c, progress)}/{c.lessons.length}</Txt>
          </View>
          <ProgressBar value={courseDoneCount(c, progress) / c.lessons.length} color={c.color} height={6} />
          {c.lessons.map((l) => (
            <View key={l.id} style={styles.row}>
              <Ionicons
                name={isDone(progress, l.id) ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={isDone(progress, l.id) ? c.color : COLORS.locked}
              />
              <View style={{ flex: 1 }}>
                <Txt>{l.title}</Txt>
                <Txt variant="caption">{l.difficulty}</Txt>
              </View>
              <StarsRow stars={progress[l.id]?.stars ?? 0} size={14} />
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

function Stat({ icon, color, value, label }: { icon: keyof typeof Ionicons.glyphMap; color: string; value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={26} color={color} />
      <Txt variant="title" style={{ fontSize: 24 }}>{value}</Txt>
      <Txt variant="caption">{label}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  top: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  stats: { flexDirection: "row", gap: SPACING.sm, paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  stat: { flex: 1, alignItems: "center", backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, paddingVertical: SPACING.md, ...SHADOW },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginHorizontal: SPACING.md, marginBottom: SPACING.md, gap: SPACING.sm, ...SHADOW },
  cardHead: { flexDirection: "row", alignItems: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.line },
});
