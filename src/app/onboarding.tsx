import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PATHS, INTRO } from "../data/courses";
import { useAppStore } from "../store/appStore";
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from "../constants/theme";
import { Txt } from "../components/Txt";
import { Button } from "../components/Button";
import { Drawing } from "../components/Drawing";
import { ProgressBar } from "../components/ProgressBar";

const MATERIALS: { icon: keyof typeof Ionicons.glyphMap; text: string }[] = [
  { icon: "document-outline", text: "Hojas de papel" },
  { icon: "pencil", text: "Un lápiz" },
  { icon: "square-outline", text: "Un borrador" },
];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [page, setPage] = useState(0);
  const [name, setName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggle = (id: string) => setInterests((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  async function finish() {
    setSaving(true);
    await updateSettings({ onboarded: true, name: name.trim(), interests });
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + SPACING.md, paddingBottom: insets.bottom + SPACING.md }]}>
      <View style={styles.progress}>
        <ProgressBar value={(page + 1) / 3} color={COLORS.primary} />
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {page === 0 && (
          <>
            <View style={styles.heroArt}>
              <Drawing lesson={PATHS[0].lessons[0]} size={150} color={PATHS[0].color} />
              <Drawing lesson={PATHS[2].lessons[1]} size={150} color={PATHS[2].color} />
            </View>
            <Txt variant="title" style={styles.center}>¡Aprende a dibujar paso a paso!</Txt>
            <Txt style={[styles.center, styles.lead]}>
              Dibujarás en papel siguiendo cada trazo. Al terminar, guarda una foto de tu dibujo en tu diario.
            </Txt>
            <Txt variant="label" style={{ marginTop: SPACING.lg, marginBottom: SPACING.sm }}>Vas a necesitar</Txt>
            {MATERIALS.map((m) => (
              <View key={m.text} style={styles.material}>
                <View style={styles.materialIcon}>
                  <Ionicons name={m.icon} size={22} color={COLORS.primary} />
                </View>
                <Txt>{m.text}</Txt>
              </View>
            ))}
          </>
        )}

        {page === 1 && (
          <>
            <Txt variant="title">¿Cómo te llamas?</Txt>
            <Txt style={styles.lead}>Lo usaremos para saludarte. Puedes dejarlo en blanco.</Txt>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
              maxLength={20}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => setPage(2)}
            />
          </>
        )}

        {page === 2 && (
          <>
            <Txt variant="title">¿Qué te gustaría dibujar?</Txt>
            <Txt style={styles.lead}>
              Elige uno o más. Primero harás el curso “{INTRO.name}” y luego verás estas rutas primero.
            </Txt>
            <View style={styles.grid}>
              {PATHS.map((c) => {
                const on = interests.includes(c.id);
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => toggle(c.id)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                    style={[styles.choice, { backgroundColor: c.soft, borderColor: on ? c.color : "transparent" }]}
                  >
                    {on && (
                      <View style={[styles.check, { backgroundColor: c.color }]}>
                        <Ionicons name="checkmark" size={16} color={COLORS.white} />
                      </View>
                    )}
                    <Drawing lesson={c.lessons[0]} size={90} color={c.color} />
                    <Txt variant="heading" style={styles.choiceName}>{c.name}</Txt>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {page > 0 && <Button label="Atrás" variant="outline" onPress={() => setPage(page - 1)} style={{ flex: 1 }} />}
        {page < 2 ? (
          <Button label="Continuar" onPress={() => setPage(page + 1)} style={{ flex: 2 }} />
        ) : (
          <Button label="¡Empezar!" icon="brush" onPress={finish} loading={saving} disabled={interests.length === 0} style={{ flex: 2 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  progress: { paddingHorizontal: SPACING.lg },
  body: { padding: SPACING.lg, paddingBottom: SPACING.xl },
  center: { textAlign: "center" },
  lead: { color: COLORS.inkSoft, marginTop: SPACING.sm },
  heroArt: { flexDirection: "row", justifyContent: "center", gap: SPACING.sm, marginVertical: SPACING.lg },
  material: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOW,
  },
  materialIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: "#ECEEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.line,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    fontFamily: FONT.bold,
    fontSize: 20,
    color: COLORS.ink,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.md, marginTop: SPACING.lg },
  choice: {
    width: "47%",
    flexGrow: 1,
    alignItems: "center",
    borderRadius: RADIUS.lg,
    borderWidth: 3,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  choiceName: { fontSize: 16, textAlign: "center", marginTop: SPACING.xs },
  check: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: { flexDirection: "row", gap: SPACING.sm, paddingHorizontal: SPACING.lg },
});
