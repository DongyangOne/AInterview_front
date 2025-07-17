import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

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

// 날짜별 일정 데이터 예시
const schedules = {
  0: "회의",
  2: "면접",
  4: "프로젝트",
  5: "프로젝트",
};

// 주간 달력 컴포넌트
function WeeklyCalendar() {
  const weekDates = getCurrentWeekDates();
  const today = new Date();

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
                  {isToday && scheduleText && <View style={styles.todayDot} />}
                  <Text style={styles.todayDateText}>{date.getDate()}</Text>
                </View>
                {scheduleText && (
                  <Text style={styles.scheduleText}>{scheduleText}</Text>
                )}
              </>
            ) : (
              <>
                {scheduleText && <View style={styles.dot} />}
                <Text style={styles.normalDateText}>{date.getDate()}</Text>
                {scheduleText && (
                  <Text style={styles.scheduleText}>{scheduleText}</Text>
                )}
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
