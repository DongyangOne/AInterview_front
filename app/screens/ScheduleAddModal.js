import React, { useRef, useState, useEffect, useMemo } from "react";
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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { pad } from "./ScheduleList";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_PAD = 32;

const importanceOptions = [
  { label: "매우 중요", value: "S", color: "#FFB7B7" },
  { label: "보통", value: "I", color: "#FFCB82" },
  { label: "중요하지 않음", value: "N", color: "#B7C3FF" },
];

export default function ScheduleAddModal({
  visible,
  onClose,
  selectedDate,
  onSave,
  isEditing = false,
  editData = null,
  saving,
}) {
  const modalAddRef = useRef(null);

  const [title, setTitle] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [tempHour, setTempHour] = useState("00");
  const [tempMinute, setTempMinute] = useState("00");
  const [priority, setPriority] = useState("");
  const [memo, setMemo] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [titleRequired, setTitleRequired] = useState(false);
  const [timeRequired, setTimeRequired] = useState(false);
  const [priorityRequired, setPriorityRequired] = useState(false);
  const [saveError, setSaveError] = useState("");

  const hourList = useMemo(() => Array.from({ length: 24 }, (_, i) => pad(i)), []);
  const minuteList = useMemo(() => Array.from({ length: 60 }, (_, i) => pad(i)), []);

  useEffect(() => {
    if (visible) {
      if (isEditing && editData) {
        setTitle(editData.title || "");
        setHour(editData.hour || "");
        setMinute(editData.minute || "");
        setPriority(
          editData.priority === "매우 중요"
            ? "S"
            : editData.priority === "중요하지 않음"
            ? "N"
            : "I"
        );
        setMemo(editData.memo || "");
        setTempHour(editData.hour || "00");
        setTempMinute(editData.minute || "00");
      } else {
        setTitle("");
        setHour("");
        setMinute("");
        setPriority("");
        setMemo("");
      }
      setSaveError("");
      modalAddRef.current?.open();
    } else {
      modalAddRef.current?.close();
    }
  }, [visible, isEditing, editData]);

  const handleModalClosed = () => {
    setTempHour("00");
    setTempMinute("00");
    handleCancel();
  };

  const getApiDateTime = () => {
    const dateObj = new Date(selectedDate);
    const yyyy = dateObj.getFullYear();
    const mm = pad(dateObj.getMonth() + 1);
    const dd = pad(dateObj.getDate());
    return `${yyyy}-${mm}-${dd} ${pad(hour)}:${pad(minute)}:00`;
  };

  const handleSave = () => {
    if (title.trim() === "") {
      setTitleRequired(true);
      setPriorityRequired(false);
      setTimeRequired(false);
      return;
    } else {
      setTitleRequired(false);
    }

    if (hour === "" || minute === "") {
      setTimeRequired(true);
      return;
    } else {
      setTimeRequired(false);
    }

    if (priority === "") {
      setPriorityRequired(true);
      setTimeRequired(false);
      return;
    } else {
      setPriorityRequired(false);
    }

    if (title.length > 7) {
      return;
    }

    AsyncStorage.getItem("userId")
      .then((userId) => {
        if (!userId) {
          throw new Error("사용자 정보가 없습니다.");
        }

        const params = {
          userId,
          title,
          time: getApiDateTime(),
          importance: priority,
          memo,
        };

        if (isEditing && editData?.id) {
          return axios.get(`${process.env.EXPO_PUBLIC_API_URL}/calendar/update`, {
            params: { ...params, calendar_id: editData.id },
            withCredentials: true,
          });
        } else {
          return axios.get(`${process.env.EXPO_PUBLIC_API_URL}/calendar/add`, {
            params,
            withCredentials: true,
          });
        }
      })
      .then((res) => {
        const calendarId = isEditing ? editData.id : res.data.calendarId || res.data.id;
        onSave &&
          onSave({
            id: calendarId,
            title,
            hour,
            minute,
            priority,
            memo,
          });
        handleCancel();
      })
      .catch((err) => {
        setSaveError("일정 저장 실패: " + (err?.response?.data?.message || err.message));
      });
  };

  const openPicker = () => {
    setTempHour(hour || "00");
    setTempMinute(minute || "00");
    setShowTimePicker(true);
  };

  const handleCancel = () => {
    setTitle("");
    setHour("");
    setMinute("");
    setPriority("");
    setMemo("");
    setSaveError("");
    setTitleRequired(false);
    setTimeRequired(false);
    setPriorityRequired(false);
    onClose && onClose();
  };

  return (
    <Modalize
      ref={modalAddRef}
      modalHeight={SCREEN_HEIGHT}
      snapPoint={SCREEN_HEIGHT * 0.66}
      handlePosition="inside"
      panGestureEnabled
      withHandle
      onClosed={handleModalClosed}
      modalStyle={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "#fff",
        paddingHorizontal: SCREEN_PAD,
        paddingTop: 20,
        paddingBottom: 30,
      }}
      overlayStyle={{
        backgroundColor: "rgba(0,0,0,0)",
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
                if (text.length <= 7) {
                  setTitle(text);
                  setTitleRequired(false);
                  setSaveError("");
                }
              }}
              placeholder="제목을 입력하세요"
              maxLength={7}
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
          <View style={{ flex: 1 }}>
            <Pressable
              style={styles.input}
              onPress={openPicker}
            >
              <Text style={{ color: hour && minute ? "#191919" : "#888" }}>
                {hour || minute ? `${hour || "00"}:${minute || "00"}` : "시간을 선택하세요."}
              </Text>
            </Pressable>
            {timeRequired && (
              <Text style={styles.errorMsg}>시간을 선택해 주세요.</Text>
            )}
          </View>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>중요도</Text>
          <View style={{ flex: 1 }}>
            <View style={styles.priorityBox}>
              {importanceOptions.map((opt) => {
                const selected = priority === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    style={[
                      styles.priorityBtn,
                      { borderColor: opt.color },
                      selected && { backgroundColor: opt.color, borderWidth: 2 },
                      !selected && { backgroundColor: "#fff", borderWidth: 2 },
                    ]}
                    onPress={() => {
                      setPriority(opt.value);
                      setPriorityRequired(false);
                    }}
                  >
                    <Text
                      style={[
                        { color: opt.color, fontSize: 13, fontWeight: "600", textAlign: "center" },
                        selected && { color: "#fff" },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {priorityRequired && (
              <Text style={styles.errorMsg}>중요도를 선택해 주세요</Text>
            )}
          </View>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>메모</Text>
          <TextInput
            style={styles.memoInput}
            multiline
            value={memo}
            onChangeText={(text) => {
              if (text.length <= 49) {
                setMemo(text);
              }
            }}
            placeholder="메모를 입력하세요"
            maxLength={49}
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
          <View
            style={{
              ...styles.pickerContainer,
              backgroundColor: "rgba(0,0,0,0)",
            }}
          >
            <View style={styles.pickerHeader}>
              <Pressable
                onPress={() => {
                  setShowTimePicker(false);
                }}
              >
                <Text>취소</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowTimePicker(false);
                  setHour(tempHour);
                  setMinute(tempMinute);
                }}
              >
                <Text style={{ color: "#5B28EB" }}>확인</Text>
              </Pressable>
            </View>
            <View style={styles.wheelPicker}>
              <WheelPickerExpo
                height={150}
                width={100}
                initialSelectedIndex={tempHour ? hourList.indexOf(tempHour) : 0}
                items={hourList.map((h) => ({
                  label: `${h}시`,
                  value: h,
                }))}
                onChange={({ item }) => setTempHour(item.value)}
              />
              <WheelPickerExpo
                height={150}
                width={100}
                initialSelectedIndex={tempMinute ? minuteList.indexOf(tempMinute) : 0}
                items={minuteList.map((m) => ({
                  label: `${m}분`,
                  value: m,
                }))}
                onChange={({ item }) => setTempMinute(item.value)}
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
    marginBottom: 10,
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
    marginTop: 15,
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
  selectedText: { color: "#fff" },
  pickerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0)",
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
    height: 270,
  },
  errorMsg: {
    color: "#FF5A5A",
    fontSize: 13,
    paddingVertical: 5,
    marginLeft: 10,
  },
});
