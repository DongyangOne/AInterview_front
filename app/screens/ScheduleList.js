import { View, Text, Pressable, StyleSheet, Dimensions, ScrollView, Modal, Image } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Modalize } from "react-native-modalize";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScheduleAddModal from "../screens/ScheduleAddModal";
import axios from "axios";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export const importanceIn = (val) => {
  switch (val) {
    case "S":
      return "매우 중요";
    case "I":
      return "보통";
    case "N":
      return "중요하지 않음";
    default:
      return val;
  }
};

export const getPriorityColor = (p) => {
  switch (p) {
    case "매우 중요":
      return "#FFB7B7";
    case "보통":
      return "#FFCB82";
    case "중요하지 않음":
      return "#B7C3FF";
    default:
      return "#888";
  }
};

export const formatTime = (h, m) => {
  const hourNum = parseInt(h, 10);
  const ampm = hourNum < 12 ? "오전" : "오후";
  const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
  return `${ampm} ${displayHour}:${m}`;
};

export const pad = (n) => String(n).padStart(2, "0");

export default function ScheduleList({
  modalRef,
  schedules,
  selectedDate,
  onOpenEditModal,
  onOpenDeleteModal,
  onModalOpen,
  onModalClose,
  showFAB,
  setshowFAB,
  onSave
}) {

    const [deleteIdx, setDeleteIdx] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [hideFAB, setHideFAB] = useState(false);

    const handleOpenAddModal = () => {
        setAddModalVisible(true);
        setHideFAB(true);
      };
    const handleCloseAddModal = () => {
        setAddModalVisible(false);
        setHideFAB(false);
      };
    const scheduleArr = schedules[selectedDate] || [];

    const handleConfirmDelete = () => {
      if (deleteIdx == null) return;
      const item = schedules[selectedDate][deleteIdx];
      if (!item || !item.id) return;

      axios
        .get(`${process.env.EXPO_PUBLIC_API_URL}/calendar/delete`, {
          params: { calendar_id: item.id },
          withCredentials: true,
        })
        .then((res) => {
          console.log("[삭제 요청 결과]", res.data);

          if (res.data.success) {
            console.log("일정 삭제 성공! 리스트 갱신.");
            onSave && onSave();
          } else {
            console.log("삭제 실패:", res.data.message);
          }
          setDeleteModalVisible(false);
          setDeleteIdx(null);
        })
        .catch((err) => {
          console.log("[일정 삭제 에러]", err);
          setDeleteModalVisible(false);
          setDeleteIdx(null);
        });
    };

  return (
    <>
      <Modalize
        ref={modalRef}
        modalHeight={SCREEN_HEIGHT}
        snapPoint={SCREEN_HEIGHT * 0.62}
        handlePosition="inside"
        panGestureEnabled
        withHandle
        closeOnOverlayTap
        modalStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "#fff",
        }}
        onOpen={onModalOpen}
        onClose={onModalClose}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalDate}>
            {new Date(selectedDate).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </Text>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
          {schedules[selectedDate]?.length ? (
            schedules[selectedDate]
              .sort((a, b) =>
                `${a.hour}${a.minute}`.localeCompare(`${b.hour}${b.minute}`)
              )
              .map((item, idx) => (
                <View key={item.id || idx} style={styles.scheduleItem}>
                  <View style={styles.scheduleTimeWrapper}>
                    {formatTime(item.hour, item.minute)
                      .split(" ")
                      .map((part, i) => (
                        <Text key={i} style={styles.scheduleTime}>
                          {part}
                        </Text>
                      ))}
                  </View>

                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() => onOpenEditModal(item, idx)}
                  >
                    <Text style={styles.scheduleTitle}>{item.title}</Text>

                    {(() => {
                      const raw = (item.priority ?? "").toString().trim();
                      let label;
                      if (raw === "매우 중요") label = "매우 중요";
                      else if (raw === "중요" || raw === "I") label = "보통";
                      else if (raw === "X" || raw === "N")
                        label = "중요하지 않음";
                      else label = raw || "보통";

                      return (
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "500",
                            color: getPriorityColor(label),
                            marginTop: 2,
                          }}
                        >
                          {label}
                        </Text>
                      );
                    })()}

                    <Text style={styles.memoText}>{item.memo}</Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>{
                      setDeleteIdx(idx);
                      setDeleteModalVisible(true);
                    }}
                    style={styles.trashBtn}
                  >
                    <Ionicons name="trash-outline" size={20} color="#888" />
                  </Pressable>
                </View>
              ))
          ) : (
            <Text>일정이 없습니다.</Text>
          )}
          </ScrollView>
        </View>
      </Modalize>
      <ScheduleAddModal
        visible={addModalVisible}
        onClose={handleCloseAddModal}
        selectedDate={selectedDate}
        onSave={onSave}
      />
      {showFAB && !hideFAB && (
        <Pressable style={styles.fab} onPress={handleOpenAddModal}>
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      )}
      {deleteModalVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.deleteModal}>
              <Image source={require("../../assets/icons/warning.png")} style={styles.deleteIcon} />
              <Text style={styles.deleteTitle}>정말 삭제 하시겠습니까?</Text>
              <Text style={styles.deleteSubtitle}>삭제하시면 복구가 불가합니다.</Text>
              <View style={styles.buttonContainer}>
                <Pressable onPress={() => setDeleteModalVisible(false)}>
                  <View style={[styles.modalBtn, styles.cancelBtn]}>
                    <Text style={styles.btnText}>취소</Text>
                  </View>
                </Pressable>
                <Pressable onPress={handleConfirmDelete}>
                  <View style={[styles.modalBtn, styles.deleteBtn]}>
                    <Text style={[styles.btnText, styles.saveText]}>삭제</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: "#fff",
    minHeight: 0,
  },
  modalDate: {
    color: "#191919",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    paddingTop: 12,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  scheduleTime: {
    fontSize: 12,
    fontWeight: "600",
    color: "#777",
    paddingRight: 24,
  },
  scheduleTitle: { color: "#191919", fontWeight: "bold", fontSize: 20 },
  memoText: { fontSize: 14, color: "#888", marginTop: 2 },
  scheduleTimeWrapper: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    minWidth: 40,
    height: 40,
  },
  trashBtn: { paddingTop: 10, justifyContent: "flex-start" },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    backgroundColor: "#5B28EB",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteModal: {
    width: 350,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
    top: -40
  },
  deleteIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
  },
  deleteSubtitle: {
    fontSize: 14,
    color: "#808080",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  modalBtn: {
    width: 140,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 7.5,
  },
  cancelBtn: {
    backgroundColor: "#DDDDDD",
  },
  deleteBtn: {
    backgroundColor: "#FF3B30",
  },
  btnText: {
    fontSize: 16,
  },
  saveText: {
    color: "white",
  },

});
