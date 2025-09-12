import React from "react";
import { Modal, View, Text, ActivityIndicator } from "react-native";

export default function LoadingModal({ visible }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <View style={{
          backgroundColor: "#fff",
          padding: 32,
          borderRadius: 12,
          alignItems: "center"
        }}>
          <ActivityIndicator size="large" color="#5900FF" style={{ marginBottom: 16 }} />
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#191919" }}>분석중...</Text>
        </View>
      </View>
    </Modal>
  );
}