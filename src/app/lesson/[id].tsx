import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { findLesson } from "../../data/courses";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";
import { Txt } from "../../components/Txt";
import { Button } from "../../components/Button";
import { Drawing } from "../../components/Drawing";

export default function LessonScreen() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const found = findLesson(id);
  const [step, setStep] = useState(-1);
  const [playKey, setPlayKey] = useState(0);

  if (!found) {
    return (
      <View style={[styles.screen, { padding: SPACING.lg, paddingTop: insets.top + SPACING.lg }]}>
        <Txt variant="heading">Lección no encontrada</Txt>
      </View>
    );
  }

  const { course, lesson } = found;
  const total = lesson.steps.length;
  const paperSize = Math.min(width - SPACING.lg * 2, 380);
  const isLast = step === total - 1;

  function next() {
    if (isLast) {
      router.replace({ pathname: "/lesson/complete", params: { id: lesson.id, mode: mode ?? "learn" } });
    } else {
      setStep(step + 1);
    }
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + SPACING.sm, paddingBottom: insets.bottom + SPACING.md }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Salir de la lección">
          <Ionicons name="close" size={28} color={COLORS.inkSoft} />
        </Pressable>
        <View style={styles.segments}>
          {lesson.steps.map((_, i) => (
            <View key={i} style={[styles.segment, { backgroundColor: i <= step ? course.color : COLORS.line }]} />
          ))}
        </View>
        <Txt variant="caption" style={{ minWidth: 34, textAlign: "right" }}>
          {step < 0 ? "" : `${step + 1}/${total}`}
        </Txt>
      </View>

      {step < 0 ? (
        <ScrollView contentContainerStyle={styles.body}>
          <Txt variant="label" style={{ color: course.color }}>{mode === "practice" ? "Práctica libre" : course.name}</Txt>
          <Txt variant="title" style={{ marginBottom: SPACING.md }}>{lesson.title}</Txt>

          <View style={[styles.paper, { alignSelf: "center" }]}>
            <Drawing lesson={lesson} size={Math.min(paperSize, 260)} color={course.color} />
          </View>

          <View style={[styles.skillCard, { backgroundColor: course.soft }]}>
            <View style={[styles.skillIcon, { backgroundColor: course.color }]}>
              <Ionicons name="sparkles" size={20} color={COLORS.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt variant="label">Habilidad</Txt>
              <Txt variant="heading">{lesson.skill.name}</Txt>
              <Txt style={{ color: COLORS.inkSoft, marginTop: 2 }}>{lesson.skill.description}</Txt>
            </View>
          </View>

          <View style={styles.meta}>
            <MetaChip icon="footsteps-outline" text={`${total} pasos`} />
            <MetaChip icon="speedometer-outline" text={lesson.difficulty} />
            <MetaChip icon="pencil" text="Papel y lápiz" />
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          <View style={[styles.paper, { alignSelf: "center" }]}>
            <Drawing lesson={lesson} step={step} size={paperSize - 24} color={course.color} playKey={playKey} />
            <Pressable
              onPress={() => setPlayKey((k) => k + 1)}
              style={styles.replay}
              accessibilityRole="button"
              accessibilityLabel="Ver el trazo otra vez"
            >
              <Ionicons name="refresh" size={20} color={COLORS.inkSoft} />
            </Pressable>
          </View>

          <Txt variant="label" style={{ marginTop: SPACING.lg, color: course.color }}>Paso {step + 1}</Txt>
          <Txt style={styles.instruction}>{lesson.steps[step].instruction}</Txt>

          {lesson.steps[step].tip && (
            <View style={styles.tip}>
              <Ionicons name="bulb" size={20} color={COLORS.star} />
              <Txt style={{ flex: 1, color: COLORS.inkSoft }}>{lesson.steps[step].tip}</Txt>
            </View>
          )}
        </ScrollView>
      )}

      <View style={styles.footer}>
        {step >= 0 && <Button label="Atrás" variant="outline" onPress={() => setStep(step - 1)} style={{ flex: 1 }} />}
        <Button
          label={step < 0 ? "Comenzar" : isLast ? "¡Terminé!" : "Ya lo dibujé"}
          icon={step < 0 ? "play" : isLast ? "checkmark" : "arrow-forward"}
          color={course.color}
          onPress={next}
          style={{ flex: 2 }}
        />
      </View>
    </View>
  );
}

function MetaChip({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon} size={16} color={COLORS.inkSoft} />
      <Txt variant="caption">{text}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { flexDirection: "row", alignItems: "center", gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  segments: { flex: 1, flexDirection: "row", gap: 6 },
  segment: { flex: 1, height: 8, borderRadius: RADIUS.full },
  body: { padding: SPACING.lg },
  paper: { backgroundColor: COLORS.paper, borderRadius: RADIUS.lg, padding: 12, borderWidth: 1, borderColor: COLORS.line, ...SHADOW },
  replay: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
    justifyContent: "center",
  },
  instruction: { fontSize: 20, lineHeight: 28, marginTop: 4 },
  tip: {
    flexDirection: "row",
    gap: SPACING.sm,
    alignItems: "flex-start",
    backgroundColor: "#FFF6DD",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  skillCard: { flexDirection: "row", gap: SPACING.md, borderRadius: RADIUS.lg, padding: SPACING.md, marginTop: SPACING.lg },
  skillIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  meta: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm, marginTop: SPACING.md },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  footer: { flexDirection: "row", gap: SPACING.sm, paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
});
