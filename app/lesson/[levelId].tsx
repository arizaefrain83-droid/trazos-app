import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useEffect } from "react";
import { CATEGORIES } from "../../src/data/categories";
import { COLORS, FONTS, SPACING, RADIUS } from "../../src/constants/theme";
import { PlaceholderImage } from "../../src/components/PlaceholderImage";

const { width } = Dimensions.get("window");

export default function LessonScreen() {
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  let category = null;
  let level = null;
  for (const cat of CATEGORIES) {
    const found = cat.levels.find((l) => l.id === levelId);
    if (found) {
      category = cat;
      level = found;
      break;
    }
  }

  useEffect(() => {
    if (level) {
      navigation.setOptions({ headerTitle: level.title });
    }
  }, [level]);

  if (!level || !category) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.error}>Nivel no encontrado</Text>
      </SafeAreaView>
    );
  }

  const step = level.steps[currentStep];
  const isLast = currentStep === level.steps.length - 1;

  function animateTransition(callback: () => void) {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -40,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(40);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }

  function handleNext() {
    if (isLast) {
      router.replace({
        pathname: "/lesson/complete",
        params: { levelId, categoryId: category!.id },
      });
    } else {
      animateTransition(() => setCurrentStep((s) => s + 1));
    }
  }

  function handlePrev() {
    if (currentStep > 0) {
      animateTransition(() => setCurrentStep((s) => s - 1));
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentStep + 1) / level.steps.length) * 100}%` as any,
                backgroundColor: category.color,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Paso {currentStep + 1} de {level.steps.length}
        </Text>
      </View>

      {/* Step content */}
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.stepHeader}>
          <View style={[styles.stepBadge, { backgroundColor: category.color }]}>
            <Text style={styles.stepBadgeText}>{currentStep + 1}</Text>
          </View>
          <Text style={styles.stepTitle}>Paso {currentStep + 1}</Text>
        </View>

        <View style={styles.imageContainer}>
          <PlaceholderImage
            imageKey={step.imageKey}
            size={width - SPACING.md * 4}
            bgColor={category.color + "15"}
          />
        </View>

        <View style={styles.instructionBox}>
          <Text style={styles.instructionText}>{step.instruction}</Text>
        </View>
      </Animated.View>

      {/* Navigation buttons */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navBtn, styles.navBtnSecondary, currentStep === 0 && styles.navBtnDisabled]}
          onPress={handlePrev}
          disabled={currentStep === 0}
        >
          <Text style={[styles.navBtnText, currentStep === 0 && styles.navBtnTextDisabled]}>
            ← Anterior
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, styles.navBtnPrimary, { backgroundColor: category.color }]}
          onPress={handleNext}
        >
          <Text style={styles.navBtnTextPrimary}>
            {isLast ? "¡Finalizar! 🎉" : "Siguiente →"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Step dots */}
      <View style={styles.dotsRow}>
        {level.steps.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentStep
                ? [styles.dotActive, { backgroundColor: category.color }]
                : i < currentStep
                ? [styles.dotDone, { backgroundColor: category.color + "60" }]
                : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  error: { padding: SPACING.lg, fontSize: FONTS.sizes.lg, color: COLORS.text },
  progressContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    gap: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: RADIUS.full,
  },
  progressText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    textAlign: "right",
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.heavy,
    color: COLORS.white,
  },
  stepTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  instructionBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
    lineHeight: 28,
    textAlign: "center",
  },
  navRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  navBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  navBtnPrimary: {},
  navBtnSecondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  navBtnDisabled: {
    opacity: 0.35,
  },
  navBtnText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  navBtnTextDisabled: {
    color: COLORS.textMuted,
  },
  navBtnTextPrimary: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.heavy,
    color: COLORS.white,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingBottom: SPACING.md,
  },
  dot: {
    height: 8,
    borderRadius: RADIUS.full,
  },
  dotActive: {
    width: 24,
  },
  dotDone: {
    width: 8,
  },
  dotInactive: {
    width: 8,
    backgroundColor: COLORS.border,
  },
});
