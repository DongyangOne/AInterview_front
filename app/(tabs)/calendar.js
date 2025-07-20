import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { Calendar as RNCalendar, DateData } from "react-native-calendars";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import Ionicons from "@expo/vector-icons/Ionicons";
import WheelPickerExpo from "react-native-wheel-picker-expo";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function Calendar() {
  const modalRef = useRef(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [selectedDate, setSelectedDate] = useState("2025-05-07");
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [hour, setHour] = useState("10");
  const [minute, setMinute] = useState("00");
  const [priority, setPriority] = useState("");
  const [memo, setMemo] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [schedules, setSchedules] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [titleRequired, setTitleRequired] = useState(false);
  const [timeRequired, setTimeRequired] = useState(false);
  const [priorityRequired, setPriorityRequired] = useState(false);

  const confirmDelete = () => {
    setSchedules((prev) => {
      const updated = { ...prev };
      updated[selectedDate] = updated[selectedDate].filter(
        (_, i) => i !== deleteIdx
      );
      return updated;
    });
    setIsDeleteConfirmVisible(false);
    setDeleteIdx(null);
  };

  const formatTime = (hour, minute) => {
    const h = parseInt(hour, 10);
    const m = parseInt(minute, 10);
    const ampm = h < 12 ? "오전" : "오후";
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${ampm} ${displayHour}:${minute}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
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

  const hourList = Array.from({ length: 24 }, (_, i) =>
    `${i}`.padStart(2, "0")
  );
  const minuteList = Array.from({ length: 60 }, (_, i) =>
    `${i}`.padStart(2, "0")
  );

  const formatHeaderDate = (dateString) => {
    const [year, month] = dateString.split("-");
    return `${year}년 ${month}월`;
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setIsModalVisible(true);
    modalRef.current?.open();
  };

  const openAddModal = () => {
    modalRef.current?.close();
    setShowAddModal(true);
  };

  const resetForm = () => {
    setTitle("");
    setMemo("");
    setPriority("");
    setHour("10");
    setMinute("00");
    setTitleRequired(false);
    setTimeRequired(false);
    setPriorityRequired(false);
  };

  const handleSave = () => {
    const isTitleValid = title.trim() !== "";
    const isTimeValid = hour !== "" && minute !== "";
    const isPriorityValid = priority !== "";

    setTitleRequired(!isTitleValid);
    setTimeRequired(!isTimeValid);
    setPriorityRequired(!isPriorityValid);

    if (!isTitleValid || !isTimeValid || !isPriorityValid) return;

    const newSchedule = { title, hour, minute, priority, memo };
    setSchedules((prev) => {
      const updated = { ...prev };
      if (!updated[selectedDate]) updated[selectedDate] = [];
      updated[selectedDate].push(newSchedule);
      return updated;
    });

    setShowAddModal(false);
    resetForm();
  };

  const handleDelete = (index) => {
    setDeleteIdx(index);
    setIsDeleteConfirmVisible(true);
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {formatHeaderDate(selectedDate)}
          </Text>
        </View>
        <RNCalendar
          current={selectedDate}
          onDayPress={onDayPress}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: "#5B28EB",
              selectedTextColor: "#ffffff",
              marked: true,
            },
          }}
          hideArrows={true}
          theme={{
            todayTextColor: "#000000",
            selectedDayTextColor: "#ffffff",
            selectedDayBackgroundColor: "#5B28EB",
          }}
        />
        <Modalize
          ref={modalRef}
          modalHeight={SCREEN_HEIGHT * 0.5}
          onClose={() => setIsModalVisible(false)}
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
                  <View key={idx} style={styles.scheduleItem}>
                    <View style={styles.scheduleTimeWrapper}>
                      {formatTime(item.hour, item.minute)
                        .split(" ")
                        .map((part, i) => (
                          <Text key={i} style={styles.scheduleTime}>
                            {part}
                          </Text>
                        ))}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.scheduleTitle}>{item.title}</Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: getPriorityColor(item.priority),
                          marginTop: 2,
                        }}
                      >
                        {item.priority}
                      </Text>
                      <Text style={styles.memoText}>{item.memo}</Text>
                    </View>
                    <Pressable
                      onPress={() => handleDelete(idx)}
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
        {isModalVisible && !showAddModal && (
          <Pressable style={styles.fab} onPress={openAddModal}>
            <Ionicons name="add" size={28} color="#fff" />
          </Pressable>
        )}
        <Modal visible={showAddModal} transparent animationType="slide">
          <View style={styles.addModalOverlay}>
            <View style={styles.addModal}>
              <Text style={styles.modalDate}>
                {new Date(selectedDate).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </Text>

              <View style={styles.inputRow}>
                <Text style={styles.label}>제목</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    if (text !== "") setTitleRequired(false);
                  }}
                  placeholder="제목을 입력하세요"
                />
                {titleRequired && <Text style={styles.required}>*</Text>}
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.label}>면접시간</Text>
                <Pressable
                  style={styles.input}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text>{`${hour}:${minute}`}</Text>
                </Pressable>
                {timeRequired && <Text style={styles.required}>*</Text>}
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.label}>중요도</Text>
                <View style={styles.priorityBox}>
                  <Pressable
                    style={[
                      styles.priorityBtn,
                      styles.unselectedRed,
                      priority === "매우 중요" && styles.selectedRed,
                    ]}
                    onPress={() => {
                      setPriority("매우 중요");
                      setPriorityRequired(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.redText,
                        priority === "매우 중요" && styles.selectedText,
                      ]}
                    >
                      매우 중요
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.priorityBtn,
                      styles.unselectedYellow,
                      priority === "보통" && styles.selectedYellow,
                    ]}
                    onPress={() => {
                      setPriority("보통");
                      setPriorityRequired(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.yellowText,
                        priority === "보통" && styles.selectedText,
                      ]}
                    >
                      보통
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.priorityBtn,
                      styles.unselectedBlue,
                      priority === "중요하지 않음" && styles.selectedBlue,
                    ]}
                    onPress={() => {
                      setPriority("중요하지 않음");
                      setPriorityRequired(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.blueText,
                        priority === "중요하지 않음" && styles.selectedText,
                        { textAlign: "center" },
                      ]}
                    >
                      중요하지{"\n"}않음
                    </Text>
                  </Pressable>
                </View>
                {priorityRequired && <Text style={styles.required}>*</Text>}
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.label}>메모</Text>
                <TextInput
                  style={styles.memoInput}
                  multiline
                  value={memo}
                  onChangeText={setMemo}
                  placeholder="메모를 입력하세요"
                />
              </View>

              <View style={styles.footerButtons}>
                <Pressable
                  style={styles.cancelBtn}
                  onPress={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                >
                  <Text>취소</Text>
                </Pressable>
                <Pressable style={styles.saveBtn} onPress={handleSave}>
                  <Text style={{ color: "#fff" }}>저장</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {showTimePicker && (
          <Modal transparent animationType="slide">
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Pressable onPress={() => setShowTimePicker(false)}>
                  <Text>취소</Text>
                </Pressable>
                <Pressable onPress={() => setShowTimePicker(false)}>
                  <Text style={{ color: "#5B28EB" }}>확인</Text>
                </Pressable>
              </View>
              <View style={styles.wheelPicker}>
                <WheelPickerExpo
                  height={150}
                  width={100}
                  items={hourList.map((h) => ({ label: `${h}시`, value: h }))}
                  onChange={({ item }) => setHour(item.value)}
                />
                <WheelPickerExpo
                  height={150}
                  width={100}
                  items={minuteList.map((m) => ({ label: `${m}분`, value: m }))}
                  onChange={({ item }) => setMinute(item.value)}
                />
              </View>
            </View>
          </Modal>
        )}
      </View>
      {isDeleteConfirmVisible && (
        <Modal transparent animationType="fade">
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
                <Pressable
                  style={styles.confirmCancelBtn}
                  onPress={() => setIsDeleteConfirmVisible(false)}
                >
                  <Text style={styles.confirmCancelText}>취소</Text>
                </Pressable>
                <Pressable
                  style={styles.confirmDeleteBtn}
                  onPress={confirmDelete}
                >
                  <Text style={styles.confirmDeleteText}>삭제</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: { fontSize: 20, fontWeight: "bold", marginRight: 8 },
  modalContent: {
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: "#fff",
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  modalDate: {
    color: "#191919",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    paddingTop: 20,
  },
  addModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  addModal: {
    paddingHorizontal: 32,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 12,
  },
  label: { fontWeight: "bold", width: 80, fontSize: 15, marginTop: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  memoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 1,
  },
  cancelBtn: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 10,
  },
  saveBtn: {
    backgroundColor: "#5B28EB",
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 10,
  },
  required: { color: "red", marginLeft: 6, fontSize: 16 },
  priorityBox: { flexDirection: "row", gap: 8 },
  priorityBtn: {
    width: 84,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderRadius: 30,
  },
  unselectedRed: { borderColor: "#FFB7B7" },
  unselectedYellow: { borderColor: "#FFCB82" },
  unselectedBlue: { borderColor: "#B7C3FF" },
  redText: { color: "#FFB7B7", fontSize: 12 },
  yellowText: { color: "#FFCB82", fontSize: 12 },
  blueText: { color: "#B7C3FF", fontSize: 12 },
  selectedText: { color: "#fff" },
  selectedRed: { backgroundColor: "#FFB7B7", borderColor: "#FFB7B7" },
  selectedYellow: { backgroundColor: "#FFCB82", borderColor: "#FFCB82" },
  selectedBlue: { backgroundColor: "#B7C3FF", borderColor: "#B7C3FF" },
  pickerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
  },
  wheelPicker: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingBottom: 20,
    justifyContent: "center",
  },
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
  scheduleTitle: {
    color: "#191919",
    fontWeight: "bold",
    fontSize: 20,
  },
  priorityText: { fontSize: 14, color: "#666", marginTop: 2 },
  memoText: { fontSize: 14, color: "#888", marginTop: 2 },
  scheduleTimeWrapper: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    minWidth: 40,
    height: 40,
  },
  trashBtn: {
    paddingTop: 10,
    justifyContent: "flex-start",
  },
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
  confirmSubtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 16,
  },
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
  confirmCancelText: {
    color: "#333",
    fontSize: 15,
  },
  confirmDeleteBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#FF5A5A",
    borderRadius: 8,
    alignItems: "center",
  },
  confirmDeleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
