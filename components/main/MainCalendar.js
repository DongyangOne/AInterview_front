import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersId = await AsyncStorage.getItem("userId");
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/calendar/thisweek`,
          {
            params: { userId: usersId },
          }
        );

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
        weeklyEvents.forEach((item) => {
          const date = new Date(item.time);
          const dayIndex = date.getDay(); // 0:일,~6:토
          if (!scheduleMap[dayIndex]) scheduleMap[dayIndex] = [];
          scheduleMap[dayIndex].push(item.title);
        });

        setSchedules(scheduleMap);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.calendarContainer}>
      {weekDates.map((date, idx) => {
        const isToday =
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate();

        const scheduleText = schedules[date.getDay()];

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
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function MainCalendar() {
  return (
    <View>
      <WeeklyCalendar />
    </View>
  );
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
    backgroundColor: "#222",
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
});
