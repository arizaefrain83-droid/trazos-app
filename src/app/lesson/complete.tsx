import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { findLesson } from "../../data/courses";
import { useAppStore } from "../../store/appStore";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";
import { Txt } from "../../components/Txt";
import { Button } from "../../components/Button";
import { Drawing } from "../../components/Drawing";
import { StarsRow } from "../../components/StarsRow";

export default function CompleteScreen() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const completeLesson = useAppStore((s) => s.completeLesson);
  const addJournalEntry = useAppStore((s) => s.addJournalEntry);
  const found = findLesson(id);

  const [checked, setChecked] = useState<boolean[]>(() => (found ? found.lesson.checklist.map(() => false) : []));
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!found) {
    return (
      <View style={[styles.screen, { padding: SPACING.lg, paddingTop: insets.top + SPACING.lg }]}>
        <Txt variant="heading">Lección no encontrada</Txt>
      </View>
    );
  }

  const { course, lesson, index } = found;
  const practice = mode === "practice";
  const stars = Math.max(1, checked.filter(Boolean).length);
  const nextInCourse = course.lessons[index + 1];

  async function pick(source: "camera" | "library") {
    const perm =
      source === "camera" ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Permiso necesario",
        source === "camera" ? "Activa la cámara para fotografiar tu dibujo." : "Activa el acceso a tus fotos para elegir tu dibujo."
      );
      return;
    }
    const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 };
    const result = source === "camera" ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
    if (!result.canceled && result.assets[0]) setPhoto(result.assets[0].uri);
  }

  async function save() {
    setSaving(true);
    try {
      if (!practice) await completeLesson(lesson.id, stars);
      if (photo) await addJournalEntry(photo, lesson.id, course.id);
      setSaved(true);
    } catch (e) {
      Alert.alert("No se pudo guardar", String(e));
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + SPACING.xl, paddingBottom: insets.bottom + SPACING.md }]}>
        <ScrollView contentContainerStyle={[styles.body, { alignItems: "center" }]}>
          <View style={[styles.trophy, { backgroundColor: course.soft }]}>
            <Ionicons name="trophy" size={56} color={course.color} />
          </View>
          <Txt variant="title" style={{ textAlign: "center", marginTop: SPACING.md }}>
            {practice ? "¡Buena práctica!" : "¡Lección completada!"}
          </Txt>
          {!practice && (
            <View style={{ marginTop: SPACING.sm }}>
              <StarsRow stars={stars} size={40} />
            </View>
          )}
          {photo && <Txt variant="caption" style={{ marginTop: SPACING.sm }}>Tu dibujo quedó guardado en Mi diario.</Txt>}

          <View style={styles.extra}>
            <Txt variant="label">Práctica extra</Txt>
            <Txt style={{ marginTop: 4 }}>{lesson.extraPractice}</Txt>
          </View>
        </ScrollView>
        <View style={styles.footerCol}>
          {!practice && nextInCourse && (
            <Button label={`Siguiente: ${nextInCourse.title}`} icon="arrow-forward" color={course.color} onPress={() => router.replace(`/lesson/${nextInCourse.id}`)} />
          )}
          <Button label="Listo" variant={!practice && nextInCourse ? "outline" : "solid"} color={course.color} onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + SPACING.md, paddingBottom: insets.bottom + SPACING.md }]}>
      <ScrollView contentContainerStyle={styles.body}>
        <Txt variant="label" style={{ color: course.color }}>{lesson.title}</Txt>
        <Txt variant="title">¡Terminaste tu dibujo!</Txt>
        <Txt style={{ color: COLORS.inkSoft, marginTop: 4 }}>Compáralo con la referencia y marca lo que lograste.</Txt>

        <View style={styles.compare}>
          <View style={styles.paper}>
            <Drawing lesson={lesson} size={120} color={course.color} />
            <Txt variant="caption" style={{ textAlign: "center", marginTop: 4 }}>Referencia</Txt>
          </View>
          <View style={styles.paper}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.photo} />
            ) : (
              <View style={[styles.photo, styles.photoEmpty]}>
                <Ionicons name="image-outline" size={36} color={COLORS.muted} />
              </View>
            )}
            <Txt variant="caption" style={{ textAlign: "center", marginTop: 4 }}>Tu dibujo</Txt>
          </View>
        </View>

        <View style={styles.photoBtns}>
          <Button label="Tomar foto" icon="camera" color={course.color} onPress={() => pick("camera")} style={{ flex: 1 }} />
          <Button label="Galería" icon="images" variant="outline" onPress={() => pick("library")} style={{ flex: 1 }} />
        </View>

        <Txt variant="label" style={{ marginTop: SPACING.lg, marginBottom: SPACING.sm }}>Revisa tu dibujo</Txt>
        {lesson.checklist.map((item, i) => (
          <Pressable
            key={item}
            onPress={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: checked[i] }}
            style={[styles.checkRow, checked[i] && { borderColor: course.color, backgroundColor: course.soft }]}
          >
            <View style={[styles.box, checked[i] && { backgroundColor: course.color, borderColor: course.color }]}>
              {checked[i] && <Ionicons name="checkmark" size={18} color={COLORS.white} />}
            </View>
            <Txt style={{ flex: 1 }}>{item}</Txt>
          </Pressable>
        ))}

        {!practice && (
          <View style={styles.starsPreview}>
            <Txt variant="caption">Ganarás</Txt>
            <StarsRow stars={stars} size={22} />
          </View>
        )}
      </ScrollView>

      <View style={styles.footerCol}>
        <Button
          label={photo ? "Guardar en mi diario" : "Continuar sin foto"}
          icon={photo ? "book" : "arrow-forward"}
          color={course.color}
          loading={saving}
          onPress={save}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  body: { padding: SPACING.lg },
  compare: { flexDirection: "row", gap: SPACING.md, marginTop: SPACING.lg, justifyContent: "center" },
  paper: { backgroundColor: COLORS.paper, borderRadius: RADIUS.lg, padding: 10, borderWidth: 1, borderColor: COLORS.line, ...SHADOW },
  photo: { width: 120, height: 120, borderRadius: RADIUS.sm },
  photoEmpty: { backgroundColor: COLORS.lockedBg, alignItems: "center", justifyContent: "center" },
  photoBtns: { flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.md },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.line,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  box: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.locked,
    alignItems: "center",
    justifyContent: "center",
  },
  starsPreview: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: SPACING.sm, marginTop: SPACING.sm },
  trophy: { width: 120, height: 120, borderRadius: 60, alignItems: "center", justifyContent: "center" },
  extra: {
    alignSelf: "stretch",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.xl,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.star,
    ...SHADOW,
  },
  footerCol: { gap: SPACING.sm, paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
});
