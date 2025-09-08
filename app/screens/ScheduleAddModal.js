import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { Modalize } from "react-native-modalize";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import { pad, importanceOut, getPriorityColor } from "./ScheduleList";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_PAD = 32;

export default function ScheduleAddModal({
  modalAddRef,
  selectedDate,
  onSave,
  onCancel,
  isEditing,
  saving,
}) {
  const [title, setTitle] = useState("");
  const [hour, setHour] = useState("10");
  const [minute, setMinute] = useState("00");
  const [priority, setPriority] = useState("보통");
  const [memo, setMemo] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [titleRequired, setTitleRequired] = useState(false);
  const [timeRequired, setTimeRequired] = useState(false);
  const [priorityRequired, setPriorityRequired] = useState(false);
  const [saveError, setSaveError] = useState("");

  const hourList = useMemo(
    () => Array.from({ length: 24 }, (_, i) => pad(i)),
    []
  );
  const minuteList = useMemo(
    () => Array.from({ length: 60 }, (_, i) => pad(i)),
    []
  );

  const handleSave = () => {
    const isTitleValid = title.trim() !== "";
    const isTimeValid = hour !== "" && minute !== "";
    const isPriorityValid = priority !== "";
    setTitleRequired(!isTitleValid);
    setTimeRequired(!isTimeValid);
    setPriorityRequired(!isPriorityValid);

    if (!isTitleValid || !isTimeValid || !isPriorityValid || title.length > 7) {
      return;
    }

    onSave({
      title,
      hour,
      minute,
      priority,
      memo,
    });
  };

  const handleCancel = () => {
    setTitle("");
    setHour("10");
    setMinute("00");
    setPriority("보통");
    setMemo("");
    onCancel();
  };

  return (
    <Modalize
      ref={modalAddRef}
      modalHeight={SCREEN_HEIGHT}
      snapPoint={SCREEN_HEIGHT * 0.66}
      handlePosition="inside"
      panGestureEnabled={true}
      withHandle={true}
      onClosed={handleCancel}
      modalStyle={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "#fff",
        paddingHorizontal: SCREEN_PAD,
        paddingTop: 20,
        paddingBottom: 30,
      }}
    >
      <View>
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
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setTitleRequired(false);
                setSaveError("");
              }}
              placeholder="제목을 입력하세요"
            />
            {titleRequired && (
              <Text style={styles.errorMsg}>제목을 입력해주세요</Text>
            )}
            {title.length > 7 && (
              <Text style={styles.errorMsg}>8글자 미만으로 입력해주세요.</Text>
            )}
          </View>
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

        {saveError !== "" && <Text style={styles.errorMsg}>{saveError}</Text>}

        <View style={styles.footerButtons}>
          <Pressable style={styles.cancelBtn} onPress={handleCancel}>
            <Text>취소</Text>
          </Pressable>

          <Pressable
            style={[styles.saveBtn, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving || title.trim().length > 7}
          >
            <Text style={{ color: "#fff" }}>{isEditing ? "수정" : "저장"}</Text>
          </Pressable>
        </View>
      </View>

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
    </Modalize>
  );
}

const styles = StyleSheet.create({
  modalDate: {
    color: "#191919",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    paddingTop: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "stretch",
    marginVertical: 12,
    marginBottom: 10,
    paddingBottom: 10,
    minHeight: 50,
  },
  label: { fontWeight: "bold", width: 80, fontSize: 15, marginTop: 4 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minHeight: 48,
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
    paddingVertical: 10,
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
  errorMsg: {
    color: "#FF5A5A",
    fontSize: 13,
    marginVertical: 10,
  },
});
