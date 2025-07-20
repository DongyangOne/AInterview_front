import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Logout({ deleteAcc, setDeleteAcc }) {
  const router = useRouter();

  const handleDelete = () => {
    setDeleteAcc(false);
    console.log("회원탈퇴");
    router.replace("/AccountDeletePassword");
  };

  return (
    <>
      {/* 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteAcc}
        onRequestClose={() => setDeleteAcc(false)}
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
              회원탈퇴
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "Medium",
                marginBottom: 26,
                color: "#000000",
              }}
            >
              탈퇴 하시겠습니까?
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
                  marginHorizontal: 4,
                  alignItems: "center",
                  backgroundColor: "#DDDDDD",
                  minWidth: 144,
                }}
                onPress={() => setDeleteAcc(false)}
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
                  회원탈퇴
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
