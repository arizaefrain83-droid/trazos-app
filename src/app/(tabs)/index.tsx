import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { INTRO } from "../../data/courses";
import { Course } from "../../data/types";
import { useAppStore } from "../../store/appStore";
import { courseDoneCount, isCourseUnlocked, isIntroDone, nextLesson, orderedPaths, totalStars } from "../../logic/progress";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";
import { Txt } from "../../components/Txt";
import { Button } from "../../components/Button";
import { Drawing } from "../../components/Drawing";
import { ProgressBar } from "../../components/ProgressBar";

export default function LearnScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const progress = useAppStore((s) => s.progress);
  const { name, interests } = useAppStore((s) => s.settings);

  const next = nextLesson(progress, interests);
  const introDone = isIntroDone(progress);
  const stars = totalStars(progress);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingTop: insets.top + SPACING.md, paddingBottom: SPACING.xxl }}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Txt variant="caption">{greeting()}</Txt>
          <Txt variant="title">{name ? `¡Hola, ${name}!` : "¡Hola!"}</Txt>
        </View>
        <Pressable onPress={() => router.push("/progress")} style={styles.starChip} accessibilityRole="button" accessibilityLabel="Ver mi progreso">
          <Ionicons name="star" size={18} color={COLORS.star} />
          <Txt variant="heading" style={{ fontSize: 16 }}>{stars}</Txt>
        </Pressable>
      </View>

      {next ? (
        <View style={[styles.hero, { backgroundColor: next.course.color }]}>
          <View style={{ flex: 1, paddingRight: SPACING.sm }}>
            <Txt variant="label" style={styles.heroLabel}>{next.course.name}</Txt>
            <Txt variant="title" style={styles.heroTitle}>{next.lesson.title}</Txt>
            <Txt style={styles.heroSkill}>Aprenderás: {next.lesson.skill.name.toLowerCase()}</Txt>
            <Button
              label="Empezar"
              icon="play"
              color={COLORS.white}
              textColor={next.course.color}
              onPress={() => router.push(`/lesson/${next.lesson.id}`)}
              style={styles.heroBtn}
            />
          </View>
          <View style={styles.heroArt}>
            <Drawing lesson={next.lesson} size={120} color={next.course.color} />
          </View>
        </View>
      ) : (
        <View style={[styles.hero, { backgroundColor: COLORS.success }]}>
          <View style={{ flex: 1 }}>
            <Txt variant="title" style={styles.heroTitle}>¡Completaste todo!</Txt>
            <Txt style={styles.heroSkill}>Sigue practicando en la pestaña Practicar.</Txt>
          </View>
        </View>
      )}

      <Txt variant="label" style={styles.section}>Curso de introducción</Txt>
      <CourseCard course={INTRO} />

      <Txt variant="label" style={styles.section}>Rutas de dibujo</Txt>
      {!introDone && (
        <View style={styles.notice}>
          <Ionicons name="lock-closed" size={18} color={COLORS.inkSoft} />
          <Txt variant="caption" style={{ flex: 1 }}>Termina “{INTRO.name}” para desbloquear las rutas.</Txt>
        </View>
      )}
      {orderedPaths(interests).map((c) => (
        <CourseCard key={c.id} course={c} favorite={interests.includes(c.id)} />
      ))}
    </ScrollView>
  );
}

function CourseCard({ course, favorite }: { course: Course; favorite?: boolean }) {
  const router = useRouter();
  const progress = useAppStore((s) => s.progress);
  const unlocked = isCourseUnlocked(course, progress);
  const done = courseDoneCount(course, progress);
  const total = course.lessons.length;

  return (
    <Pressable
      onPress={() => router.push(`/course/${course.id}`)}
      style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.98 }] }]}
      accessibilityRole="button"
    >
      <View style={[styles.cardArt, { backgroundColor: unlocked ? course.soft : COLORS.lockedBg }]}>
        <Drawing lesson={course.lessons[course.lessons.length - 1]} size={76} color={unlocked ? course.color : COLORS.locked} />
        {!unlocked && (
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={14} color={COLORS.white} />
          </View>
        )}
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Txt variant="heading" style={{ fontSize: 18, flexShrink: 1 }}>{course.name}</Txt>
          {favorite && <Ionicons name="heart" size={14} color={course.color} />}
        </View>
        <Txt variant="caption">{course.tagline}</Txt>
        <View style={styles.cardProgress}>
          <View style={{ flex: 1 }}>
            <ProgressBar value={done / total} color={unlocked ? course.color : COLORS.locked} height={6} />
          </View>
          <Txt variant="caption">{done}/{total}</Txt>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
    </Pressable>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  starChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    ...SHADOW,
  },
  hero: {
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  heroLabel: { color: "rgba(255,255,255,0.85)" },
  heroTitle: { color: COLORS.white, fontSize: 26, marginTop: 2 },
  heroSkill: { color: "rgba(255,255,255,0.92)", marginTop: 4 },
  heroBtn: { marginTop: SPACING.md, alignSelf: "flex-start", minHeight: 48, borderBottomColor: "rgba(0,0,0,0.15)" },
  heroArt: { backgroundColor: COLORS.paper, borderRadius: RADIUS.lg, padding: 6, transform: [{ rotate: "4deg" }] },
  section: { marginTop: SPACING.lg, marginBottom: SPACING.sm, marginHorizontal: SPACING.lg },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.lockedBg,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm + 4,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOW,
  },
  cardArt: { width: 84, height: 84, borderRadius: RADIUS.md, alignItems: "center", justifyContent: "center" },
  lockBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.inkSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  cardProgress: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, marginTop: 4 },
});
