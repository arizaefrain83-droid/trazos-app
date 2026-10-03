import { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COURSES } from "../../data/courses";
import { useAppStore } from "../../store/appStore";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";
import { Txt } from "../../components/Txt";
import { Drawing } from "../../components/Drawing";
import { StarsRow } from "../../components/StarsRow";

const ITEMS = COURSES.flatMap((course) => course.lessons.map((lesson) => ({ course, lesson })));

export default function PracticeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const progress = useAppStore((s) => s.progress);
  const [filter, setFilter] = useState<string | null>(null);

  const items = filter ? ITEMS.filter((x) => x.course.id === filter) : ITEMS;
  const cardWidth = (width - SPACING.md * 2 - SPACING.md) / 2;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + SPACING.md }]}>
      <View style={{ paddingHorizontal: SPACING.lg }}>
        <Txt variant="title">Práctica libre</Txt>
        <Txt style={{ color: COLORS.inkSoft, marginTop: 2 }}>Dibuja lo que quieras, las veces que quieras.</Txt>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="Todo" active={filter === null} color={COLORS.ink} onPress={() => setFilter(null)} />
          {COURSES.map((c) => (
            <Chip key={c.id} label={c.name} active={filter === c.id} color={c.color} onPress={() => setFilter(c.id)} />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={items}
        keyExtractor={(x) => x.lesson.id}
        numColumns={2}
        columnWrapperStyle={{ gap: SPACING.md }}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: SPACING.xxl, gap: SPACING.md }}
        renderItem={({ item: { course, lesson } }) => (
          <Pressable
            onPress={() => router.push({ pathname: "/lesson/[id]", params: { id: lesson.id, mode: "practice" } })}
            style={({ pressed }) => [styles.card, { width: cardWidth }, pressed && { transform: [{ scale: 0.97 }] }]}
            accessibilityRole="button"
          >
            <View style={[styles.art, { backgroundColor: course.soft }]}>
              <Drawing lesson={lesson} size={cardWidth - 40} color={course.color} />
            </View>
            <View style={{ padding: SPACING.sm + 4, gap: 2 }}>
              <Txt variant="heading" style={{ fontSize: 16 }} numberOfLines={1}>{lesson.title}</Txt>
              <View style={styles.cardMeta}>
                <Txt variant="caption">{lesson.steps.length} pasos · {lesson.difficulty}</Txt>
              </View>
              {progress[lesson.id]?.completed && <StarsRow stars={progress[lesson.id].stars} size={13} />}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

function Chip({ label, active, color, onPress }: { label: string; active: boolean; color: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[styles.chip, active ? { backgroundColor: color, borderColor: color } : null]}
    >
      <Txt variant="caption" style={{ color: active ? COLORS.white : COLORS.ink, fontSize: 14 }}>{label}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  chips: { gap: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.line,
    backgroundColor: COLORS.surface,
  },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, overflow: "hidden", ...SHADOW },
  art: { alignItems: "center", justifyContent: "center", paddingVertical: 14 },
  cardMeta: { flexDirection: "row", alignItems: "center" },
});
