import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

export function StarsRow({ stars, size = 16, max = 3 }: { stars: number; size?: number; max?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }} accessibilityLabel={`${stars} de ${max} estrellas`}>
      {Array.from({ length: max }, (_, i) => (
        <Ionicons key={i} name={i < stars ? "star" : "star-outline"} size={size} color={i < stars ? COLORS.star : COLORS.locked} />
      ))}
    </View>
  );
}
