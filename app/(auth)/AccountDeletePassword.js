import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function AccountDeletePassword() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    router.replace("/AccountDeleteReason");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* 헤더 */}
      <View
        style={{
          height: 56,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,

          borderBottomColor: "#eee",
          backgroundColor: "#fff",
        }}
      >
        <TouchableOpacity onPress={() => router.replace("../(tabs)/myPage")}>
          <Image
            source={require("../../assets/icons/bell_arrow.png")}
            style={{ width: 24, height: 24, marginLeft: 6 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "400",
            color: "#222",
          }}
        >
          회원탈퇴
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {/* 본문 */}
      <View style={{ paddingTop: 36 }}>
        <Text
          style={{
            marginLeft: 32,
            marginBottom: 16,
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          현재 비밀번호
        </Text>

        <View style={{ alignItems: "center" }}>
          <TextInput
            style={{
              width: "84.47%",
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            placeholder="비밀번호를 입력"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      {/* 다음 버튼은 아래로 고정 */}
      <View style={{ flex: 1 }} />

      <View
        style={{
          alignItems: "center",
          paddingBottom: 36,
        }}
      >
        <TouchableOpacity
          style={{
            width: "84.47%",
            backgroundColor: "#D9D9D9",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={handleSubmit}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
