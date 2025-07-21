import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import { Calendar as RNCalendar, DateData } from "react-native-calendars";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import Ionicons from "@expo/vector-icons/Ionicons";
import WheelPickerExpo from "react-native-wheel-picker-expo";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function Calendar() {
  const modalRef = useRef(null);
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
    Alert.alert("삭제 확인", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          setSchedules((prev) => {
            const updated = { ...prev };
            updated[selectedDate] = updated[selectedDate].filter(
              (_, i) => i !== index
            );
            return updated;
          });
        },
      },
    ]);
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
                    <Text style={styles.scheduleTime}>
                      {item.hour}:{item.minute}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.scheduleTitle}>{item.title}</Text>
                      <Text style={styles.priorityText}>{item.priority}</Text>
                      <Text style={styles.memoText}>{item.memo}</Text>
                    </View>
                    <Pressable onPress={() => handleDelete(idx)}>
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
    marginBottom: 16,
  },
  scheduleTime: { fontWeight: "bold", fontSize: 16, width: 60 },
  scheduleTitle: { fontWeight: "bold", fontSize: 16 },
  priorityText: { fontSize: 14, color: "#666", marginTop: 2 },
  memoText: { fontSize: 13, color: "#888", marginTop: 2 },
});
