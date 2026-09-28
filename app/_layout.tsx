import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useProgressStore } from "../src/store/progressStore";
import { COLORS } from "../src/constants/theme";

export default function RootLayout() {
  const init = useProgressStore((s) => s.init);

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="category/[id]"
          options={{
            headerShown: true,
            headerBackTitle: "Categorías",
            headerTitle: "",
            headerStyle: { backgroundColor: COLORS.background },
            headerTintColor: COLORS.text,
          }}
        />
        <Stack.Screen
          name="lesson/[levelId]"
          options={{
            headerShown: true,
            headerBackTitle: "Niveles",
            headerTitle: "",
            headerStyle: { backgroundColor: COLORS.background },
            headerTintColor: COLORS.text,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="lesson/complete"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </>
  );
}
