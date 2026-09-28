import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useProgressStore } from "../../src/store/progressStore";
import { CATEGORIES } from "../../src/data/categories";
import { COLORS, FONTS, SPACING, RADIUS } from "../../src/constants/theme";
import { StarsRow } from "../../src/components/StarsRow";
import { GalleryPhoto } from "../../src/data/types";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function computeStars(levelId: string): number {
  // Simple star logic: always award 3 stars for completing all steps
  // In a real app this could factor in time or accuracy
  return 3;
}

export default function CompleteScreen() {
  const { levelId, categoryId } = useLocalSearchParams<{
    levelId: string;
    categoryId: string;
  }>();
  const router = useRouter();
  const completeLevel = useProgressStore((s) => s.completeLevel);
  const addPhoto = useProgressStore((s) => s.addPhoto);
  const isCompleted = useProgressStore((s) => s.isLevelCompleted(levelId ?? ""));
  const existingStars = useProgressStore((s) => s.getLevelStars(levelId ?? ""));

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [levelSaved, setLevelSaved] = useState(false);

  const category = CATEGORIES.find((c) => c.id === categoryId);
  let levelData: (typeof CATEGORIES)[0]["levels"][0] | undefined;
  for (const cat of CATEGORIES) {
    const found = cat.levels.find((l) => l.id === levelId);
    if (found) { levelData = found; break; }
  }

  const stars = computeStars(levelId ?? "");

  async function handlePickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceso a tu galería para guardar tu dibujo.",
        [{ text: "Entendido" }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function handleTakePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceso a tu cámara para fotografiar tu dibujo.",
        [{ text: "Entendido" }]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function handleSaveAndContinue() {
    if (saving) return;
    setSaving(true);

    try {
      if (levelId) {
        await completeLevel(levelId, stars);
      }

      if (photoUri && levelId && categoryId) {
        const photo: GalleryPhoto = {
          id: generateId(),
          uri: photoUri,
          levelId,
          categoryId,
          createdAt: new Date().toISOString(),
        };
        await addPhoto(photo);
      }

      setLevelSaved(true);
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar el progreso. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  function handleGoHome() {
    router.dismissAll();
  }

  function handleGoCategory() {
    if (categoryId) {
      router.dismissAll();
      router.push(`/category/${categoryId}`);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        {/* Celebration header */}
        <View style={[styles.hero, { backgroundColor: category ? category.color + "15" : COLORS.background }]}>
          <Text style={styles.heroEmoji}>🎉</Text>
          <Text style={styles.heroTitle}>¡Nivel Completado!</Text>
          <Text style={styles.heroSub}>{levelData?.title ?? ""}</Text>
          <View style={styles.starsBox}>
            <StarsRow stars={stars} size={36} />
          </View>
          {isCompleted && existingStars >= stars && (
            <Text style={styles.alreadyDone}>¡Ya habías completado este nivel!</Text>
          )}
        </View>

        {/* Photo upload section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 ¡Sube tu dibujo!</Text>
          <Text style={styles.sectionSub}>
            Toma una foto de tu dibujo para guardarlo en tu galería personal.
          </Text>

          {photoUri ? (
            <View style={styles.photoPreviewContainer}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              <TouchableOpacity
                style={styles.changePhotoBtn}
                onPress={handlePickPhoto}
              >
                <Text style={styles.changePhotoText}>Cambiar foto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity
                style={[styles.photoBtn, { backgroundColor: category?.color ?? COLORS.primary }]}
                onPress={handleTakePhoto}
              >
                <Text style={styles.photoBtnEmoji}>📷</Text>
                <Text style={styles.photoBtnText}>Tomar foto</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.photoBtn, styles.photoBtnSecondary]}
                onPress={handlePickPhoto}
              >
                <Text style={styles.photoBtnEmoji}>🖼️</Text>
                <Text style={[styles.photoBtnText, { color: COLORS.text }]}>
                  Elegir de galería
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Action buttons */}
        {!levelSaved ? (
          <TouchableOpacity
            style={[
              styles.saveBtn,
              { backgroundColor: category?.color ?? COLORS.primary },
              saving && styles.saveBtnDisabled,
            ]}
            onPress={handleSaveAndContinue}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.saveBtnText}>
                {photoUri ? "Guardar y continuar ✓" : "Continuar sin foto →"}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.doneSection}>
            <Text style={styles.doneText}>✅ Progreso guardado</Text>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: category?.color ?? COLORS.primary }]}
              onPress={handleGoCategory}
            >
              <Text style={styles.actionBtnText}>Ver más niveles</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnSecondary]}
              onPress={handleGoHome}
            >
              <Text style={[styles.actionBtnText, { color: COLORS.text }]}>Ir al inicio</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: SPACING.xxl },
  hero: {
    alignItems: "center",
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  heroEmoji: { fontSize: 72, marginBottom: SPACING.sm },
  heroTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.heavy,
    color: COLORS.text,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  starsBox: {
    marginTop: SPACING.sm,
  },
  alreadyDone: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    fontStyle: "italic",
  },
  section: {
    margin: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 6,
  },
  sectionSub: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  photoButtons: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  photoBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    gap: 6,
  },
  photoBtnSecondary: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  photoBtnEmoji: { fontSize: 28 },
  photoBtnText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
  photoPreviewContainer: { alignItems: "center", gap: SPACING.sm },
  photoPreview: {
    width: 200,
    height: 200,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.border,
  },
  changePhotoBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  changePhotoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
  },
  saveBtn: {
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.heavy,
    color: COLORS.white,
  },
  doneSection: {
    padding: SPACING.md,
    gap: SPACING.sm,
    alignItems: "center",
  },
  doneText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
  },
  actionBtn: {
    width: "100%",
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  actionBtnSecondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  actionBtnText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
});
