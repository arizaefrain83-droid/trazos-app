import { Tabs } from "expo-router";
import { COLORS, FONTS } from "../../src/constants/theme";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: Platform.OS === "ios" ? 88 : 64,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: FONTS.sizes.xs,
          fontWeight: FONTS.weights.medium,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Categorías",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji="🎨" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progreso",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji="⭐" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: "Galería",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji="🖼️" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

import { Text } from "react-native";

function TabIcon({ emoji, focused }: { emoji: string; color: unknown; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 26 : 22, opacity: focused ? 1 : 0.6 }}>
      {emoji}
    </Text>
  );
}
