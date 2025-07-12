import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack, Tabs } from "expo-router";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Stack initialRouteName="Login">
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="bell" options={{ headerShown: false }} />
      <Stack.Screen
        name="AccountDeletePassword"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AccountDeleteReason"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AccountDeleteCheck"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AccountDeleteLast" options={{ headerShown: false }} />
    </Stack>
  );
}
