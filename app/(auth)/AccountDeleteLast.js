import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from 'axios';

const REASONS = [
  "면접 기능을 사용하기 어려워요.",
  "피드백 기능이 불편해요.",
  "다른 계정이 있어요.",
  "기타",
];

export default function AccountDeleteLast() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [showEtcInput, setShowEtcInput] = useState(false);
  const [etcReason, setEtcReason] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  useEffect(() => {
    setModalVisible(true); // 페이지 진입 시 첫 번째 모달 띄우기
  }, []);

  const handleDelete = async () => {
    try {
      // 실제 API 호출
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/delete/deleteUser`);
      if (response.data.success) {
        setModalVisible(false);
        setConfirmModalVisible(true); // 두 번째 모달 띄우기
      } else {
        // 실패 시 에러 핸들링 (옵션)
        alert(response.data.message || "탈퇴에 실패했습니다.");
      }
    } catch (error) {
      alert("네트워크 오류 또는 탈퇴에 실패했습니다.");
    }
  };

  const handleConfirm = () => {
    setConfirmModalVisible(false);
    router.replace("/Start");
  };

  const handleSelect = (reason) => {
    setSelectedReason(reason);
    setDropdownOpen(false);
    setShowEtcInput(false);
    setShowWarning(false);
    setEtcReason("");
    if (reason === "기타") setShowEtcInput(true);
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
          borderBottomWidth: 1,
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

      {/* 탈퇴 사유 선택 */}
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

      {/* 기타 사유 입력 */}
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
            <Text style={{ color: "#FF5151", fontSize: 12 }}>
              {showWarning ? "사유를 입력해주세요." : ""}
            </Text>
            <Text style={{ color: "#808080", fontSize: 13 }}>
              {`${etcReason.length}/200`}
            </Text>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }} />

      {/* 다음 버튼 */}
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
          disabled={!selectedReason}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>다음</Text>
        </TouchableOpacity>
      </View>

      {/* 첫 번째 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000040",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 339,
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#000000",
                fontWeight: "600",
                marginBottom: 24,
              }}
            >
              정말 탈퇴하시겠습니까?
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                marginBottom: 26,
                color: "#000000",
                textAlign: "center",
              }}
            >
              탈퇴 후에는 계정 복구가 불가능합니다.
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginHorizontal: 4,
                  alignItems: "center",
                  backgroundColor: "#DDDDDD",
                  minWidth: 144,
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={{
                    color: "#000000",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginHorizontal: 4,
                  alignItems: "center",
                  backgroundColor: "#5900FF",
                  minWidth: 144,
                }}
                onPress={handleDelete}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  탈퇴하기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 두 번째 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000040",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 339,
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#000000",
                fontWeight: "600",
                marginBottom: 24,
              }}
            >
              회원탈퇴가 완료되었습니다.
            </Text>

            <TouchableOpacity
              style={{
                width: "100%",
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                backgroundColor: "#5900FF",
                marginTop: 8,
              }}
              onPress={handleConfirm}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                완료
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
