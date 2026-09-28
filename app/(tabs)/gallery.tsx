import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import { useProgressStore } from "../../src/store/progressStore";
import { CATEGORIES } from "../../src/data/categories";
import { COLORS, FONTS, SPACING, RADIUS } from "../../src/constants/theme";
import { GalleryPhoto } from "../../src/data/types";

const { width } = Dimensions.get("window");
const PHOTO_SIZE = (width - SPACING.md * 2 - SPACING.sm * 2) / 3;

export default function GalleryScreen() {
  const gallery = useProgressStore((s) => s.gallery);
  const removePhoto = useProgressStore((s) => s.removePhoto);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  function getCategoryName(categoryId: string) {
    return CATEGORIES.find((c) => c.id === categoryId)?.name ?? categoryId;
  }

  function getLevelTitle(levelId: string) {
    for (const cat of CATEGORIES) {
      const level = cat.levels.find((l) => l.id === levelId);
      if (level) return level.title;
    }
    return levelId;
  }

  function handleDelete(photo: GalleryPhoto) {
    Alert.alert(
      "Eliminar foto",
      "¿Seguro que quieres eliminar este dibujo de tu galería?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setSelectedPhoto(null);
            removePhoto(photo.id);
          },
        },
      ]
    );
  }

  if (gallery.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Galería</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🖼️</Text>
          <Text style={styles.emptyTitle}>¡Aún no hay dibujos!</Text>
          <Text style={styles.emptyText}>
            Completa una lección y sube una foto de tu dibujo para verla aquí.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Galería</Text>
        <Text style={styles.headerSub}>{gallery.length} dibujos guardados</Text>
      </View>

      <FlatList
        data={gallery}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedPhoto(item)}
            activeOpacity={0.85}
          >
            <Image source={{ uri: item.uri }} style={styles.thumb} />
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={!!selectedPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        {selectedPhoto && (
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setSelectedPhoto(null)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Image source={{ uri: selectedPhoto.uri }} style={styles.modalImage} />
            <View style={styles.modalInfo}>
              <Text style={styles.modalCategory}>
                {getCategoryName(selectedPhoto.categoryId)}
              </Text>
              <Text style={styles.modalLevel}>{getLevelTitle(selectedPhoto.levelId)}</Text>
              <Text style={styles.modalDate}>
                {new Date(selectedPhoto.createdAt).toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(selectedPhoto)}
            >
              <Text style={styles.deleteText}>🗑️ Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: Platform.OS === "android" ? SPACING.xl : SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.heavy,
    color: COLORS.text,
  },
  headerSub: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  grid: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  row: {
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  thumb: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.border,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xxl,
  },
  emptyEmoji: { fontSize: 56, marginBottom: SPACING.md },
  emptyTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.md,
  },
  modalClose: {
    position: "absolute",
    top: 56,
    right: SPACING.md,
    padding: SPACING.sm,
    zIndex: 10,
  },
  modalCloseText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
  },
  modalImage: {
    width: width - SPACING.md * 2,
    height: width - SPACING.md * 2,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.border,
  },
  modalInfo: {
    alignItems: "center",
    marginTop: SPACING.md,
    gap: 4,
  },
  modalCategory: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.medium,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  modalLevel: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
  modalDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  deleteButton: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  deleteText: {
    color: "#FF6B6B",
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
  },
});
