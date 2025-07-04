import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>로그인 페이지</Text>
      <Button
        title="로그인"
        onPress={() => {
          router.replace("/(tabs)/home");
        }}
      />
    </SafeAreaView>
  );
}
