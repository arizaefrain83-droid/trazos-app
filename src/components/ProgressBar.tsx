import { View } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";

export function ProgressBar({ value, color, height = 8, track = COLORS.line }: { value: number; color: string; height?: number; track?: string }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={{ height, backgroundColor: track, borderRadius: RADIUS.full, overflow: "hidden" }}>
      <View style={{ width: `${pct}%`, height: "100%", backgroundColor: color, borderRadius: RADIUS.full }} />
    </View>
  );
}
