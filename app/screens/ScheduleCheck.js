import { StyleSheet } from "react-native";

export const getMarkedDates = (schedules) => {
  const markedDates = {};
  for (const date in schedules) {
    if (schedules[date]?.length > 0) {
      markedDates[date] = {
        hasEvent: true,
        marked: true,
        dotColor: "#5B28EB",
      };
    }
  }
  return markedDates;
};

export const dayStyles = StyleSheet.create({
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
});
