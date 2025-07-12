import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function AccountDeleteReason() {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState(null);

  const feedbackList = [
    { id: 1, title: "ONE 면접 피드백 내용", date: "2022.2.2" },
    { id: 2, title: "ONE 면접 피드백 내용", date: "2022.2.2" },
  ];

  const handleSubmit = () => {
    router.replace("/AccountDeleteLast");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View
        style={{
          height: 56,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          borderBottomColor: "#eee",
          borderBottomWidth: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => router.replace("/AccountDeleteReason")}
        >
          <Image
            source={require("../../assets/icons/bell_arrow.png")}
            style={{ width: 24, height: 24, marginLeft: 6 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "400", color: "#222" }}>
          회원탈퇴
        </Text>
        <View style={{ width: 28 }} />
      </View>
      <View>
        <Text
          style={{
            fontWeight: "600",
            fontSize: 24,
            color: "#000000",
            paddingLeft: 32,
            paddingTop: 36,
          }}
        >
          지금 탈퇴하시면 {"\n"}
          모든 면접 내역이 사라져요!
        </Text>
        <Text
          style={{
            fontWeight: "500",
            fontSize: 16,
            color: "#808080",
            paddingLeft: 32,
            marginTop: 8,
          }}
        >
          서비스를 탈퇴하기 전에 사라지는 정보를 확인하세요.
        </Text>
      </View>
      <View style={{ alignItems: "center", marginTop: 42 }}>
        <View
          style={{
            width: "84.47%",
            height: 49,
            marginBottom: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "500", fontSize: 14, color: "#000000" }}>
            진행한 면접
          </Text>

          <Text style={{ fontWeight: "500", fontSize: 14, color: "#808080" }}>
            총 2개
          </Text>
        </View>
      </View>

      {/* 피드백 리스트 스크롤 영역 */}
      <ScrollView
        contentContainerStyle={{ alignItems: "center", paddingBottom: 16 }}
        style={{ flex: 1 }}
      >
        {feedbackList.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={{
              borderRadius: 12,
              backgroundColor:
                selectedReason === item.id ? "#D9D9D9" : "#F5F5F5",
              width: "84.47%",
              height: 49,
              marginBottom: 8,
              padding: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onPress={() => setSelectedReason(item.id)}
          >
            <Text style={{ fontWeight: "600", fontSize: 14, color: "#000000" }}>
              {item.title}
            </Text>
            <Text style={{ fontWeight: "500", fontSize: 14, color: "#ACACAC" }}>
              {item.date}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={{ alignItems: "center", paddingBottom: 36 }}>
        <TouchableOpacity
          style={{
            width: "84.47%",
            backgroundColor: selectedReason ? "#222" : "#D9D9D9",
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
