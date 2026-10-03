import { Text, TextProps, StyleSheet } from "react-native";
import { COLORS, FONT } from "../constants/theme";

type Variant = "title" | "heading" | "body" | "caption" | "label";

export function Txt({ variant = "body", style, ...rest }: TextProps & { variant?: Variant }) {
  return <Text {...rest} style={[styles[variant], style]} />;
}

const styles = StyleSheet.create({
  title: { fontFamily: FONT.black, fontSize: 30, color: COLORS.ink, letterSpacing: -0.5 },
  heading: { fontFamily: FONT.bold, fontSize: 20, color: COLORS.ink },
  body: { fontFamily: FONT.regular, fontSize: 16, lineHeight: 23, color: COLORS.ink },
  caption: { fontFamily: FONT.regular, fontSize: 13, color: COLORS.inkSoft },
  label: { fontFamily: FONT.bold, fontSize: 12, letterSpacing: 0.8, textTransform: "uppercase", color: COLORS.inkSoft },
});
