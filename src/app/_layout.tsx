import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Nunito_600SemiBold } from "@expo-google-fonts/nunito/600SemiBold";
import { Nunito_800ExtraBold } from "@expo-google-fonts/nunito/800ExtraBold";
import { Nunito_900Black } from "@expo-google-fonts/nunito/900Black";
import { useAppStore } from "../store/appStore";
import { COLORS } from "../constants/theme";
import { Txt } from "../components/Txt";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Nunito_600SemiBold, Nunito_800ExtraBold, Nunito_900Black });
  const ready = useAppStore((s) => s.ready);
  const onboarded = useAppStore((s) => s.settings.onboarded);
  const init = useAppStore((s) => s.init);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    init().catch((e: unknown) => setError(String(e)));
  }, [init]);

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: COLORS.bg }}>
        <Txt variant="heading">No se pudo abrir tu progreso</Txt>
        <Txt variant="caption" style={{ marginTop: 8, textAlign: "center" }}>{error}</Txt>
      </View>
    );
  }

  if (!fontsLoaded || !ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg }}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.bg } }}>
        <Stack.Protected guard={!onboarded}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={onboarded}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="course/[id]" />
          <Stack.Screen name="lesson/[id]" options={{ gestureEnabled: false }} />
          <Stack.Screen name="lesson/complete" options={{ gestureEnabled: false }} />
          <Stack.Screen name="progress" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
