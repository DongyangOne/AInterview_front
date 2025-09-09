import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ScheduleList from "../screens/ScheduleList";
import ScheduleAddModal from "../screens/ScheduleAddModal";
import { getMarkedDates, dayStyles } from "../screens/ScheduleCheck";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_PAD = 32;

const todayISO = () => {
  const now = new Date();
  const y = String(now.getFullYear());
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const importanceOut = { "매우 중요": "S", 보통: "I", "중요하지 않음": "N" };
const importanceIn = (val) => {
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
const pad = (n) => String(n).padStart(2, "0");
const splitDate = (iso) => ({
  year: Number(iso.slice(0, 4)),
  month: Number(iso.slice(5, 7)),
  day: Number(iso.slice(8, 10)),
});

const pickTime = (raw) => {
  const s = String(raw || "").trim();
  const only = s.includes(" ") ? s.split(" ")[1] : s;
  const [h, m] = only.split(":");
  return { h: pad(h || "00"), m: pad(m || "00") };
};

const normalizeList = (arr = []) =>
  arr.map((it) => {
    const rawTime = it.time ?? it?.시간 ?? "";
    const { h, m } = pickTime(rawTime);
    return {
      id: it.calendar_id ?? it.id,
      title: it.title ?? it?.제목 ?? "",
      hour: h,
      minute: m,
      priority: importanceIn(it.importance ?? it?.중요도 ?? "보통"),
      memo: it.memo ?? it?.메모 ?? "",
    };
  });

export default function Calendar() {
  const modalRef = useRef(null);
  const modalAddRef = useRef(null);
  const KOREAN_DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
  const [showFAB, setShowFAB] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showYMPicker, setShowYMPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
  const [pickerMonth, setPickerMonth] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0")
  );
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw =
          (await AsyncStorage.getItem("user")) ||
          (await AsyncStorage.getItem("authUser")) ||
          (await AsyncStorage.getItem("userId"));
        let uid = null;
        if (raw) {
          const obj = (() => {
            try {
              return JSON.parse(raw);
            } catch {
              return raw;
            }
          })();
          uid = obj?.user_id ?? obj?.id ?? obj ?? null;
        }
        if (uid != null) setUserId(String(uid));
      } catch (e) {
        console.log("[auth] userId load error", e?.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (!userId) return;
    setSchedules({});
    setSelectedDate(todayISO());
    fetchMonth(todayISO());
  }, [userId]);

  const fetchMonth = async (iso = selectedDate) => {
    if (!userId) return;
    try {
      setLoading(true);
      const { year, month } = splitDate(iso);

      await axios
        .get(`${process.env.EXPO_PUBLIC_API_URL}/calendar/month`, {
          params: {
            userId,
            year,
            month: Number(month),
            _: Date.now(),
          },
        })
        .then((res) => {
          console.log("[calendar/month 성공]", res.status, res.data);

          const byDay = {};
          (res.data?.data || []).forEach((row) => {
            const y = row.year ?? row?.년 ?? year;
            const m = pad(row.month ?? row?.월 ?? month);
            const d = pad(row.day ?? row?.일);
            const key = `${y}-${m}-${d}`;
            if (!byDay[key]) byDay[key] = [];
            byDay[key].push(normalizeList([row])[0]);
          });
          setSchedules(byDay);
        })
        .catch((error) => {
          console.log(
            "[calendar/month 실패]",
            error.response?.status,
            error.response?.data || error.message
          );
        });
    } finally {
      setLoading(false);
    }
  };

  const fetchDay = async (iso = selectedDate) => {
    if (!userId) return;
    try {
      const { year, month, day } = splitDate(iso);

      await axios
        .get(`${process.env.EXPO_PUBLIC_API_URL}/calendar/day`, {
          params: {
            userId,
            year,
            month: Number(month),
            day: Number(day),
            _: Date.now(),
          },
          headers: { "Cache-Control": "no-cache" },
        })
        .then((res) => {
          console.log("[calendar/day 성공]", res.status, res.data);
          const list = normalizeList(res.data?.data);
          setSchedules((prev) => ({ ...prev, [iso]: list }));
        })
        .catch((error) => {
          console.log(
            "[calendar/day 실패]",
            error.response?.status,
            error.response?.data || error.message
          );
        });
    } catch (e) {
      console.log("[calendar/day 예외]", e.message);
    }
  };

  const onDayPress = async (day) => {
    const dateStr = day.dateString;
    if (selectedDate !== dateStr) {
      setSelectedDate(dateStr);
    }
    await fetchDay(dateStr);
    if (modalRef.current) {
      setTimeout(() => {
        modalRef.current?.open?.();
      }, 150);
    }
  };

  const handleSave = async (scheduleData) => {
    if (!userId) {
      Alert.alert("저장 오류", "로그인 정보가 없습니다.");
      return;
    }

    try {
      setSaving(true);
      const { title, hour, minute, priority, memo } = scheduleData;
      const { year, month, day } = splitDate(selectedDate);
      const timeFull = `${selectedDate} ${hour}:${minute}:00`;
      const importanceCode = importanceOut[priority];
      const safeMemo = memo?.trim() || "";

      const isOk = (data) =>
        data?.affected === 1 ||
        data?.affectedRows > 0 ||
        data?.success === true ||
        data?.result === true ||
        data?.result === "success" ||
        data?.status === "OK";

      let ok = false;

      await axios
        .get(`${process.env.EXPO_PUBLIC_API_URL}/calendar/add`, {
          params: {
            userId,
            title,
            time: timeFull,
            importance: importanceCode,
            memo: safeMemo,
            year,
            month: Number(month),
            day: Number(day),
          },
          headers: { "Cache-Control": "no-cache" },
        })
        .then((res) => {
          console.log("[calendar/add 성공]", res.status, res.data);
          ok = isOk(res.data);
        })
        .catch((error) => {
          console.log(
            "[calendar/add 실패]",
            error.response?.status,
            error.response?.data || error.message
          );
        });

      await fetchDay(selectedDate);

      if (!ok) {
        Alert.alert("저장 실패", "일정 저장에 실패했습니다.");
        console.log("[calendar/save 실패] 저장/수정 결과가 OK 아님");
        return;
      }

      setTimeout(() => {
        modalAddRef.current?.close();
        setShowAddModal(false);
      }, 300);
    } catch (e) {
      Alert.alert("오류", e.message);
      console.log("[calendar/save 예외]", e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setTimeout(() => {
      modalAddRef.current?.open();
    }, 300);
  };

  const handleCancelModal = () => {
    setTimeout(() => {
      setShowAddModal(false);
    }, 300);
  };

  const openYM = () => {
    const { year, month } = splitDate(selectedDate);
    setPickerYear(year);
    setPickerMonth(pad(month));
    setShowYMPicker(true);
  };

  const confirmYM = () => {
    const next = `${pickerYear}-${pickerMonth}-01`;
    setSelectedDate(next);
    setShowYMPicker(false);
    fetchMonth(next);
  };

  const calendarKey = selectedDate.slice(0, 7);

  const currYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currYear - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => pad(i + 1));

  const markedDates = useMemo(() => {
    const map = getMarkedDates(schedules);
    map[selectedDate] = { ...(map[selectedDate] || {}), selected: true };
    return map;
  }, [schedules, selectedDate]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarHeaderText}>
            {`${splitDate(selectedDate).year}년 ${
              splitDate(selectedDate).month
            }월`}
          </Text>
          <Pressable
            onPress={openYM}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="caret-down" size={18} color="#191919" />
          </Pressable>
        </View>
        <View style={styles.weekDaysRow}>
          {KOREAN_DAY_NAMES.map((day, index) => (
            <Text key={index} style={[styles.weekDay]}>
              {day}
            </Text>
          ))}
        </View>

        <RNCalendar
          renderHeader={() => null}
          hideDayNames={true}
          key={calendarKey}
          current={selectedDate}
          onDayPress={onDayPress}
          onMonthChange={({ year, month }) =>
            fetchMonth(`${year}-${pad(month)}-01`)
          }
          markedDates={markedDates}
          dayComponent={({ date, state, marking }) => {
            const selected = !!marking?.selected;
            const hasEvent = !!marking?.hasEvent;
            return (
              <Pressable
                onPress={() => onDayPress({ dateString: date.dateString })}
                style={dayStyles.dayCell}
              >
                <View
                  style={[
                    dayStyles.dayCircle,
                    selected && dayStyles.dayCircleSelected,
                  ]}
                >
                  {hasEvent && (
                    <View
                      style={[
                        dayStyles.eventDotTop,
                        selected && dayStyles.eventDotOnSelected,
                      ]}
                    />
                  )}
                  <Text
                    style={[
                      dayStyles.dayLabel,
                      selected && dayStyles.dayLabelSelected,
                      state === "disabled" && styles.dayLabelDisabled,
                    ]}
                  >
                    {date.day}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          hideArrows={true}
          theme={{
            todayTextColor: "#000000",
            selectedDayTextColor: "#ffffff",
            selectedDayBackgroundColor: "#5B28EB",
          }}
        />

        <ScheduleList
          modalRef={modalRef}
          schedules={schedules}
          selectedDate={selectedDate}
          onOpenAddModal={handleOpenAddModal}
          onOpenEditModal={() => {
            Alert.alert("수정", "수정 기능은 제외되었습니다.");
          }}
          onOpenDeleteModal={() => {
            Alert.alert("삭제", "삭제 기능은 제외되었습니다.");
          }}
          onModalOpen={() => setShowFAB(true)}
          onModalClose={() => setShowFAB(false)}
          showFAB={showFAB && !showAddModal}
        />

        {showAddModal ? (
          <ScheduleAddModal
            modalAddRef={modalAddRef}
            selectedDate={selectedDate}
            onSave={handleSave}
            onCancel={handleCancelModal}
            saving={saving}
          />
        ) : null}

        {showYMPicker && (
          <Modal transparent animationType="fade">
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Pressable onPress={() => setShowYMPicker(false)}>
                  <Text>취소</Text>
                </Pressable>
                <Pressable onPress={confirmYM}>
                  <Text style={{ color: "#5B28EB" }}>확인</Text>
                </Pressable>
              </View>
              <View style={styles.wheelPicker}>
                <WheelPickerExpo
                  height={160}
                  width={120}
                  items={years.map((y) => ({ label: `${y}년`, value: y }))}
                  onChange={({ item }) => setPickerYear(item.value)}
                  initialSelectedIndex={years.findIndex(
                    (y) => y === pickerYear
                  )}
                />
                <WheelPickerExpo
                  height={160}
                  width={100}
                  items={months.map((m) => ({ label: `${m}월`, value: m }))}
                  onChange={({ item }) => setPickerMonth(item.value)}
                  initialSelectedIndex={months.findIndex(
                    (m) => m === pickerMonth
                  )}
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
    paddingHorizontal: SCREEN_PAD,
    paddingTop: 120,
    backgroundColor: "#fff",
  },
  modalContent: {
    paddingHorizontal: SCREEN_PAD,
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
    paddingTop: 12,
  },
  addModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  addModal: {
    paddingHorizontal: SCREEN_PAD,
    backgroundColor: "#fff",
    paddingTop: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    minHeight: SCREEN_HEIGHT * 0.6,
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

  dayCell: {
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dayCircleSelected: {
    backgroundColor: "#5B28EB",
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#191919",
  },
  dayLabelSelected: {
    color: "#FFFFFF",
  },
  dayLabelDisabled: {
    color: "#C8C8C8",
  },
  eventDotTop: {
    position: "absolute",
    top: 3,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#5B28EB",
  },
  eventDotOnSelected: {
    backgroundColor: "#FFFFFF",
  },
  errorMsg: {
    color: "#FF5A5A",
    fontSize: 13,
    marginVertical: 10,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  calendarHeaderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#191919",
  },
  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 4,
    marginTop: 20,
  },
  weekDay: {
    width: 45,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#191919",
  },
});
