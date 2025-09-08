import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Modalize } from "react-native-modalize";
import Ionicons from "@expo/vector-icons/Ionicons";

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
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteModal,
  onModalOpen,
  onModalClose,
  showFAB,
}) {
  return (
    <>
      <Modalize
        ref={modalRef}
        modalHeight={1000}
        snapPoint={1000 * 0.5}
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
                    onPress={() => onOpenDeleteModal(idx)}
                    style={styles.trashBtn}
                  >
                    <Ionicons name="trash-outline" size={20} color="#888" />
                  </Pressable>
                </View>
              ))
          ) : (
            <Text>일정이 없습니다.</Text>
          )}
        </View>
      </Modalize>
      {showFAB && (
        <Pressable style={styles.fab} onPress={onOpenAddModal}>
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: "#fff",
    minHeight: 1000 * 0.5,
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
});
