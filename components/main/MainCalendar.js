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

// 주간 달력 컴포넌트
function WeeklyCalendar() {
  const weekDates = getCurrentWeekDates();
  const today = new Date();
  const [schedules, setSchedules] = useState({});

  useEffect(() => {
    axios
      .get("http://183.101.17.181:3001/calendar/thisweek", {
        params: { userId: 1 },
      })
      .then((res) => {
        const scheduleMap = {};
        const weekStart = new Date(weekDates[0]);
        weekStart.setHours(0, 0, 0, 0); // 자정 시작

        const weekEnd = new Date(weekDates[6]);
        weekEnd.setHours(23, 59, 59, 999); // 하루 끝
        //가져온 값의 길이를 스토리지에 저장
        const getcount = res.data.data.length;
        //문자열로 변환
        AsyncStorage.setItem("weekSchedules", getcount.toString());

        console.log("갯수", getcount);
        console.log("0", weekStart.toLocaleString("ko-KR"));

        console.log("6", weekEnd);
        res.data.data.forEach((item) => {
          const date = new Date(item.time);
          console.log(
            "받아온 시간 한국시간 버전",
            date.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })
          );

          // 이번 주 범위 체크
          if (
            //이번주 시작 시간보다 크고  이번주 마지막 시간보다 작을 때 작동
            date.getTime() >= weekStart.getTime() &&
            date.getTime() <= weekEnd.getTime()
          ) {
            console.log("시작", weekStart.getTime());
            console.log("마지막", weekEnd.getTime());
            //2025.8.8 14:00
            console.log("밀리초", date.getTime());

            //요일 숫자로 반환
            const dayIndex = date.getDay();
            //해당 날짜 배열 없을 시 생성
            if (!scheduleMap[dayIndex]) {
              scheduleMap[dayIndex] = [];
            }
            //배열에 값 추가
            scheduleMap[dayIndex].push(item.title);
          }
        });
        setSchedules(scheduleMap);
      })
      .catch((err) => {
        console.log(err);
      });
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

function MainCalendar() {
  return (
    <View>
      <WeeklyCalendar />
    </View>
  );
}

export default MainCalendar;

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
