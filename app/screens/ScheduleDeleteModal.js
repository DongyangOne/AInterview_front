import React from "react";
import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ScheduleDeleteModal({ isVisible, onCancel, onDelete }) {
  return (
    <Modal transparent animationType="fade" visible={isVisible}>
      <View style={styles.confirmOverlay}>
        <View style={styles.confirmBox}>
          <Ionicons
            name="warning-outline"
            size={40}
            color="#666"
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.confirmTitle}>정말 삭제 하시겠습니까?</Text>
          <Text style={styles.confirmSubtitle}>
            삭제하시면 복구가 불가능합니다.
          </Text>
          <View style={styles.confirmBtnRow}>
            <Pressable style={styles.confirmCancelBtn} onPress={onCancel}>
              <Text style={styles.confirmCancelText}>취소</Text>
            </Pressable>
            <Pressable style={styles.confirmDeleteBtn} onPress={onDelete}>
              <Text style={styles.confirmDeleteText}>삭제</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#191919",
    marginBottom: 4,
  },
  confirmSubtitle: { fontSize: 13, color: "#666", marginBottom: 16 },
  confirmBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  confirmCancelText: { color: "#333", fontSize: 15 },
  confirmDeleteBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#FF5A5A",
    borderRadius: 8,
    alignItems: "center",
  },
  confirmDeleteText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
