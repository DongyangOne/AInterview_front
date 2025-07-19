import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const REASONS = [
  "면접 기능을 사용하기 어려워요.",
  "피드백 기능이 불편해요.",
  "다른 계정이 있어요.",
  "기타",
];

export default function AccountDeleteReason() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [showEtcInput, setShowEtcInput] = useState(false);
  const [etcReason, setEtcReason] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const handleSelect = (reason) => {
    setSelectedReason(reason);
    setDropdownOpen(false);
    setShowEtcInput(false);
    setShowWarning(false);
    setEtcReason("");
    if (reason === "기타") {
      setShowEtcInput(true);
    }
  };

  const handleSubmit = () => {
    if (!selectedReason) return;

    if (selectedReason === "기타") {
      if (!etcReason.trim()) {
        setShowWarning(true);
        return;
      }
      setShowWarning(false);
      router.replace("/AccountDeleteCheck");
      return;
    }

    router.replace("/AccountDeleteCheck");
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
        }}
      >
        <TouchableOpacity
          onPress={() => router.replace("/AccountDeletePassword")}
        >
          <Image
            source={require("../../assets/icons/del_arrow.png")}
            style={{ width: 24, height: 48, marginLeft: 6 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "400", color: "#222" }}>
          회원탈퇴
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={{ paddingTop: 36 }}>
        <Text
          style={{
            marginLeft: 32,
            marginBottom: 16,
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          탈퇴 사유
        </Text>

        <View style={{ alignItems: "center", marginLeft: 32, width: "84.47%" }}>
          <View style={{ width: "100%", position: "relative" }}>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                borderBottomLeftRadius: dropdownOpen ? 0 : 8,
                borderBottomRightRadius: dropdownOpen ? 0 : 8,
                padding: 19,
                backgroundColor: "#fff",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 11,
              }}
              onPress={() => setDropdownOpen((prev) => !prev)}
              activeOpacity={0.8}
            >
              <Text style={{ color: selectedReason ? "#222" : "#aaa" }}>
                {selectedReason || "선택해주세요"}
              </Text>
              <Image
                source={
                  dropdownOpen
                    ? require("../../assets/icons/arrow_up.png")
                    : require("../../assets/icons/arrow_down.png")
                }
                style={{ width: 18, height: 18, tintColor: "#999" }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {dropdownOpen && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderTopWidth: 0,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  backgroundColor: "#fff",
                  position: "absolute",
                  top: 56,
                  left: 0,
                  width: "100%",
                  zIndex: 10,
                }}
              >
                {REASONS.map((reason, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={{
                      padding: 18,
                      borderBottomWidth: idx !== REASONS.length - 1 ? 1 : 0,
                      borderBottomColor: "#eee",
                    }}
                    onPress={() => handleSelect(reason)}
                  >
                    <Text style={{ color: "#222" }}>{reason}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {showEtcInput && (
        <View
          style={{
            alignItems: "center",
            marginTop: 24,
            width: "100%",
          }}
        >
          <TextInput
            style={{
              width: "84.47%",
              height: 187,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 8,
              padding: 21,
              textAlignVertical: "top",
              color: "#000000",
              fontSize: 15,
              backgroundColor: "#fff",
            }}
            placeholder="기타 사유를 입력해주세요"
            placeholderTextColor="#808080"
            multiline
            value={etcReason}
            onChangeText={(text) => {
              setEtcReason(text);
              setShowWarning(false);
            }}
            maxLength={200}
          />

          <View
            style={{
              width: "84.47%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 6,
              minHeight: 18,
            }}
          >
            <Text
              style={{
                color: "#FF5151",
                fontSize: 12,
              }}
            >
              {showWarning ? "사유를 입력해주세요." : ""}
            </Text>
            <Text
              style={{
                color: "#808080",
                fontSize: 13,
              }}
            >
              {`${etcReason.length}/200`}
            </Text>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }} />

      <View style={{ alignItems: "center", paddingBottom: 36 }}>
        <TouchableOpacity
          style={{
            width: "84.47%",
            backgroundColor: "#D9D9D9",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={handleSubmit}
          disabled={!selectedReason}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
