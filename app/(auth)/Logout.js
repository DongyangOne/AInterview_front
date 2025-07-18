import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Logout() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    setModalVisible(false);
    console.log("로그아웃 처리");
    router.replace("/Login");
  };

  return (
    //밑에 임시 버튼
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 로그아웃 버튼 */}
      <TouchableOpacity
        style={{
          backgroundColor: "#5900FF",
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: "SemiBold",
          }}
        >
          로그아웃
        </Text>
      </TouchableOpacity>

      {/* 모달 */}
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
              width: 280,
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              alignItems: "center",
              width: 339,
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
              로그아웃
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "Medium",
                marginBottom: 26,
                color: "#000000",
              }}
            >
              로그아웃 하시겠습니까?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
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
              <View
                style={{
                  width: 14,
                }}
              ></View>

              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,

                  alignItems: "center",
                  backgroundColor: "#5900FF",
                  minWidth: 144,
                }}
                onPress={handleLogout}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  로그아웃
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
