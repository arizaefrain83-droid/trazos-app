import { useState } from "react";
import { Alert, FlatList, Image, Modal, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { findLesson, PATHS } from "../../data/courses";
import { JournalEntry } from "../../data/types";
import { useAppStore } from "../../store/appStore";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";
import { Txt } from "../../components/Txt";
import { Button } from "../../components/Button";
import { Drawing } from "../../components/Drawing";

export default function JournalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const journal = useAppStore((s) => s.journal);
  const removeJournalEntry = useAppStore((s) => s.removeJournalEntry);
  const [selected, setSelected] = useState<JournalEntry | null>(null);

  const size = (width - SPACING.md * 2 - SPACING.sm * 2) / 3;
  const sel = selected ? findLesson(selected.lessonId) : undefined;

  function confirmDelete(entry: JournalEntry) {
    Alert.alert("Eliminar dibujo", "¿Quieres quitar este dibujo de tu diario?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setSelected(null);
          removeJournalEntry(entry.id);
        },
      },
    ]);
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + SPACING.md }]}>
      <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.md }}>
        <Txt variant="title">Mi diario</Txt>
        <Txt style={{ color: COLORS.inkSoft, marginTop: 2 }}>
          {journal.length === 0 ? "Aquí se guardan las fotos de tus dibujos." : `${journal.length} ${journal.length === 1 ? "dibujo" : "dibujos"}`}
        </Txt>
      </View>

      {journal.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyArt}>
            <Drawing lesson={PATHS[3].lessons[0]} size={130} color={COLORS.muted} />
          </View>
          <Txt variant="heading" style={{ textAlign: "center" }}>Tu diario está vacío</Txt>
          <Txt style={{ textAlign: "center", color: COLORS.inkSoft, marginTop: 4, marginBottom: SPACING.lg }}>
            Al terminar una lección, toma una foto de tu dibujo para guardarla aquí.
          </Txt>
          <Button label="Ir a aprender" icon="school" onPress={() => router.navigate("/")} />
        </View>
      ) : (
        <FlatList
          data={journal}
          keyExtractor={(e) => e.id}
          numColumns={3}
          columnWrapperStyle={{ gap: SPACING.sm }}
          contentContainerStyle={{ paddingHorizontal: SPACING.md, gap: SPACING.sm, paddingBottom: SPACING.xxl }}
          renderItem={({ item }) => (
            <Pressable onPress={() => setSelected(item)} accessibilityRole="button" accessibilityLabel="Ver dibujo">
              <Image source={{ uri: item.uri }} style={{ width: size, height: size, borderRadius: RADIUS.md, backgroundColor: COLORS.line }} />
            </Pressable>
          )}
        />
      )}

      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        {selected && (
          <View style={[styles.modal, { paddingTop: insets.top + SPACING.md, paddingBottom: insets.bottom + SPACING.md }]}>
            <View style={styles.modalTop}>
              <Pressable onPress={() => setSelected(null)} hitSlop={12} accessibilityRole="button" accessibilityLabel="Cerrar">
                <Ionicons name="close" size={28} color={COLORS.inkSoft} />
              </Pressable>
              <Pressable onPress={() => confirmDelete(selected)} hitSlop={12} accessibilityRole="button" accessibilityLabel="Eliminar">
                <Ionicons name="trash-outline" size={24} color={COLORS.danger} />
              </Pressable>
            </View>
            <Image source={{ uri: selected.uri }} style={[styles.big, { width: width - SPACING.lg * 2, height: width - SPACING.lg * 2 }]} />
            {sel && (
              <View style={styles.info}>
                <View style={[styles.ref, { backgroundColor: sel.course.soft }]}>
                  <Drawing lesson={sel.lesson} size={72} color={sel.course.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt variant="label" style={{ color: sel.course.color }}>{sel.course.name}</Txt>
                  <Txt variant="heading">{sel.lesson.title}</Txt>
                  <Txt variant="caption">
                    {new Date(selected.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                  </Txt>
                </View>
              </View>
            )}
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: SPACING.xl, paddingBottom: SPACING.xxl * 2 },
  emptyArt: { backgroundColor: COLORS.paper, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.lg, transform: [{ rotate: "-4deg" }], ...SHADOW },
  modal: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: SPACING.lg },
  modalTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING.md },
  big: { borderRadius: RADIUS.lg, backgroundColor: COLORS.line },
  info: { flexDirection: "row", alignItems: "center", gap: SPACING.md, marginTop: SPACING.lg },
  ref: { borderRadius: RADIUS.md, padding: 6 },
});
