import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { findCourse, INTRO } from "../../data/courses";
import { useAppStore } from "../../store/appStore";
import { courseDoneCount, isCourseUnlocked, isDone, isLessonUnlocked } from "../../logic/progress";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";
import { Txt } from "../../components/Txt";
import { Drawing } from "../../components/Drawing";
import { StarsRow } from "../../components/StarsRow";
import { ProgressBar } from "../../components/ProgressBar";

const NODE = 104;
const ROW = 190;
const OFFSETS = [0, -0.22, 0, 0.22];

export default function CourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const progress = useAppStore((s) => s.progress);
  const course = findCourse(id);

  if (!course) {
    return (
      <View style={[styles.screen, { padding: SPACING.lg, paddingTop: insets.top + SPACING.lg }]}>
        <Txt variant="heading">Curso no encontrado</Txt>
      </View>
    );
  }

  const unlocked = isCourseUnlocked(course, progress);
  const done = courseDoneCount(course, progress);
  const centers = course.lessons.map((_, i) => ({
    x: width / 2 + OFFSETS[i % OFFSETS.length] * width,
    y: i * ROW + NODE / 2 + SPACING.lg,
  }));
  const mapHeight = course.lessons.length * ROW + SPACING.lg;
  const connector = centers
    .slice(1)
    .map((c, i) => {
      const p = centers[i];
      const midY = (p.y + c.y) / 2;
      return `M${p.x} ${p.y} C${p.x} ${midY} ${c.x} ${midY} ${c.x} ${c.y}`;
    })
    .join(" ");

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { backgroundColor: course.color, paddingTop: insets.top + SPACING.sm }]}>
        <Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button" accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={26} color={COLORS.white} />
        </Pressable>
        <Txt variant="label" style={{ color: "rgba(255,255,255,0.85)" }}>{course.kind === "intro" ? "Curso de introducción" : "Ruta de dibujo"}</Txt>
        <Txt variant="title" style={{ color: COLORS.white }}>{course.name}</Txt>
        <Txt style={{ color: "rgba(255,255,255,0.92)" }}>{course.tagline}</Txt>
        <View style={styles.headerProgress}>
          <View style={{ flex: 1 }}>
            <ProgressBar value={done / course.lessons.length} color={COLORS.white} track="rgba(255,255,255,0.3)" />
          </View>
          <Txt style={{ color: COLORS.white }}>{done}/{course.lessons.length}</Txt>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + SPACING.xxl }}>
        {!unlocked && (
          <View style={styles.notice}>
            <Ionicons name="lock-closed" size={18} color={COLORS.inkSoft} />
            <Txt variant="caption" style={{ flex: 1 }}>Primero termina el curso “{INTRO.name}”.</Txt>
          </View>
        )}

        <View style={{ height: mapHeight }}>
          <Svg width={width} height={mapHeight} style={StyleSheet.absoluteFill}>
            <Path d={connector} stroke={COLORS.line} strokeWidth={10} strokeLinecap="round" strokeDasharray={[2, 18]} fill="none" />
          </Svg>

          {course.lessons.map((lesson, i) => {
            const open = isLessonUnlocked(course, i, progress);
            const complete = isDone(progress, lesson.id);
            const current = open && !complete;
            const stars = progress[lesson.id]?.stars ?? 0;
            const c = centers[i];
            return (
              <View key={lesson.id} style={[styles.nodeWrap, { left: c.x - 90, top: c.y - NODE / 2 }]}>
                <Pressable
                  disabled={!open}
                  onPress={() => router.push(`/lesson/${lesson.id}`)}
                  accessibilityRole="button"
                  accessibilityLabel={`${lesson.title}${open ? "" : ", bloqueada"}`}
                  style={({ pressed }) => [
                    styles.node,
                    {
                      borderColor: open ? course.color : COLORS.locked,
                      backgroundColor: open ? COLORS.paper : COLORS.lockedBg,
                      borderBottomWidth: pressed ? 4 : 8,
                    },
                    current && styles.current,
                  ]}
                >
                  <Drawing lesson={lesson} size={70} color={open ? course.color : COLORS.locked} />
                  {complete && (
                    <View style={[styles.badge, { backgroundColor: COLORS.success }]}>
                      <Ionicons name="checkmark" size={16} color={COLORS.white} />
                    </View>
                  )}
                  {!open && (
                    <View style={[styles.badge, { backgroundColor: COLORS.inkSoft }]}>
                      <Ionicons name="lock-closed" size={13} color={COLORS.white} />
                    </View>
                  )}
                </Pressable>
                {current && (
                  <View style={[styles.startTag, { backgroundColor: course.color }]}>
                    <Txt variant="label" style={{ color: COLORS.white, fontSize: 11 }}>Empieza aquí</Txt>
                  </View>
                )}
                <Txt variant="heading" style={[styles.nodeTitle, !open && { color: COLORS.muted }]} numberOfLines={1}>
                  {lesson.title}
                </Txt>
                {complete ? <StarsRow stars={stars} size={14} /> : <Txt variant="caption">{lesson.difficulty}</Txt>}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  back: { marginLeft: -8, marginBottom: SPACING.sm, width: 40, height: 40, justifyContent: "center" },
  headerProgress: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, marginTop: SPACING.md },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    margin: SPACING.md,
    marginBottom: 0,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.lockedBg,
  },
  nodeWrap: { position: "absolute", width: 180, alignItems: "center", gap: 2 },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW,
  },
  current: { transform: [{ scale: 1.06 }] },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  startTag: { marginTop: -12, paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full },
  nodeTitle: { fontSize: 16, marginTop: 6 },
});
