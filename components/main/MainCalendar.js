import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

// 이번 주(일~토) 날짜 배열 반환
function getCurrentWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

function WeeklyCalendar() {
  const weekDates = getCurrentWeekDates();
  const today = new Date();
  const [schedules, setSchedules] = useState({});
  const [schedulesConut, setSchedulesConst] = useState({});
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const fetchData = async () => {
        try {
          const usersId = await AsyncStorage.getItem("userId");
          await axios
            .get(`${process.env.EXPO_PUBLIC_API_URL}/mainpage/calendar`, {
              params: { userId: usersId },
            })
            .then((res) => {
              // 이번 주 시작/끝
              const weekStart = new Date(weekDates[0]);
              weekStart.setHours(0, 0, 0, 0);
              const weekEnd = new Date(weekDates[6]);
              weekEnd.setHours(23, 59, 59, 999);

              // 이번 주 일정만 필터링
              const weeklyEvents = res.data.data.filter((item) => {
                const date = new Date(item.time); //가져온 값의 시간
                return date >= weekStart && date <= weekEnd;
              });

              const scheduleMap = {};
              const scheduleMapC = {}; // 요일별 총 개수 카운터로 사용

              weeklyEvents.forEach((item) => {
                const date = new Date(item.time);
                const dayIndex = date.getDay(); // 0:일,~6:토
                const dayIndexC = date.getDay(); // 0:일,~6:토
                if (!scheduleMap[dayIndex]) scheduleMap[dayIndex] = [];
                // 요일별 총 개수 누적 (숫자)
                if (!scheduleMapC[dayIndexC]) scheduleMapC[dayIndexC] = 0;
                scheduleMapC[dayIndexC] += 1;

                // 요일별 일정 최대 3개까지만 추가
                if (scheduleMap[dayIndex].length < 3) {
                  scheduleMap[dayIndex].push(item.title);
                }
              });

              setSchedules(scheduleMap);
              setSchedulesConst(scheduleMapC);
              console.log(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (err) {
          console.error(err);
        }
      };

      fetchData();
    }
  }, [isFocused]);

  return (
    <View style={styles.calendarContainer}>
      {weekDates.map((date, idx) => {
        const isToday =
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate();

        const scheduleText = schedules[date.getDay()];
        // 해당 요일의 총 일정 개수 (없으면 0)
        const scheduleCount = schedulesConut[date.getDay()] || 0;

        return (
          <TouchableOpacity
            key={idx}
            style={styles.dayContainer}
            activeOpacity={0.7}
          >
            {isToday ? (
              <>
                <View style={styles.todayCircle}>
                  {scheduleText && <View style={styles.todayDot} />}
                  <Text style={styles.todayDateText}>{date.getDate()}</Text>
                </View>
                {scheduleText &&
                  scheduleText.map((t, i) => (
                    <Text key={i} style={styles.scheduleText}>
                      {t}
                    </Text>
                  ))}
                {scheduleCount > 3 && (
                  <Text style={styles.countText}>+{scheduleCount - 3}</Text>
                )}
              </>
            ) : (
              <>
                {scheduleText && <View style={styles.dot} />}
                <Text style={styles.normalDateText}>{date.getDate()}</Text>
                {scheduleText &&
                  scheduleText.map((t, i) => (
                    <Text key={i} style={styles.scheduleText}>
                      {t}
                    </Text>
                  ))}
                {scheduleCount > 3 && (
                  <Text style={styles.countText}>+{scheduleCount - 3}</Text>
                )}
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function MainCalendar() {
  return <WeeklyCalendar />;
}

const styles = StyleSheet.create({
  calendarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "2%",
    width: "100%",
    alignSelf: "flex-start",
  },
  dayContainer: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    position: "relative",
  },
  todayCircle: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5900FF",
    borderRadius: 15,
    marginTop: 8,
    position: "relative",
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#fff",
    position: "absolute",
    top: 3,
  },
  todayDateText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    top: 1,
  },
  normalDateText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#222",
    marginTop: 16,
    marginBottom: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#5900FF",
    position: "absolute",
    top: 12,
    zIndex: 1,
  },
  scheduleText: {
    fontSize: 10,
    color: "#222",
    marginTop: 6,
    textAlign: "center",
    maxWidth: 40,
    lineHeight: 10,
    alignSelf: "center",
  },
  countText: {
    fontSize: 10,
    color: "#888",
    marginTop: 4,
  },
});
