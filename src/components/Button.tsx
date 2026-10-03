import { Pressable, StyleSheet, View, ViewStyle, StyleProp, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONT, RADIUS } from "../constants/theme";
import { Txt } from "./Txt";

interface Props {
  label: string;
  onPress: () => void;
  color?: string;
  variant?: "solid" | "outline";
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}

export function Button({ label, onPress, color = COLORS.primary, variant = "solid", icon, disabled, loading, style, textColor }: Props) {
  const solid = variant === "solid";
  const fg = textColor ?? (solid ? COLORS.white : COLORS.ink);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        solid
          ? { backgroundColor: color, borderBottomColor: shade(color), borderBottomWidth: pressed ? 1 : 4 }
          : styles.outline,
        pressed && { transform: [{ translateY: solid ? 3 : 1 }] },
        (disabled || loading) && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.row}>
          {icon && <Ionicons name={icon} size={20} color={fg} />}
          <Txt style={[styles.label, { color: fg }]}>{label}</Txt>
        </View>
      )}
    </Pressable>
  );
}

function shade(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.round(v * 0.78));
  const r = f((n >> 16) & 255);
  const g = f((n >> 8) & 255);
  const b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  outline: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.line,
    borderBottomWidth: 4,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: { fontFamily: FONT.bold, fontSize: 17 },
});
