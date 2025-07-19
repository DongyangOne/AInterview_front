import React, { useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";

function RoundedBar({
  value = 0,
  height = 7,
  backgroundColor = "#E4E4E4",
  barColor = "#5900FF",
}) {
  const percent = Math.max(0, Math.min(100, value));
  return (
    <View
      style={[
        styles.barContainer,
        { height, backgroundColor, borderRadius: height / 2 },
      ]}
    >
      <View
        style={{
          width: `${percent}%`,
          height: "100%",
          backgroundColor: barColor,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}

function MainFeedback() {
  const [shouldScroll, setShouldScroll] = useState(false);
  const scrollRef = useRef(null);
  const [textBoxHeight, setTextBoxHeight] = useState(227);

  const evaluationData = [
    { label: "업무이해도", percent: 77 },
    { label: "기술역량", percent: 65 },
    { label: "의사소통", percent: 88 },
  ];

  const expandedNotice = [
    {
      a: "위기대처능력 73% 자세 64% 자신감 55%",
      b: "닉네임님은 지난 aa 회사 면접에서 업무이해도, 위기대처능력, 자세에서는 강한 편이고, 자신감, 표정, 말투에서는 아쉬운 편이에요.",
      c: "다음 면접에서는 자신감, 표정, 말투에 더 노력해 보는 게 좋을 것 같아요",
    },
  ];

  const toggleTextHeight = () => {
    setTextBoxHeight((prev) => (prev === 227 ? 412 : 227));
    setShouldScroll(true);
  };

  return (
    <View style={[styles.container, { minHeight: textBoxHeight }]}>
      {/* 헤더 영역 */}
      <View style={styles.headerRow}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>aa 회사 면접</Text>
          <Text style={styles.date}>2025.07.07</Text>
        </View>
        <Text style={styles.rightTime}>1일전</Text>
      </View>

      {/* 퍼센트 바 */}
      {evaluationData.map((item, i) => (
        <View key={i} style={styles.barRow}>
          <Text style={styles.barLabel}>{item.label}</Text>
          <View style={styles.barWrapper}>
            <RoundedBar value={item.percent} />
          </View>
          <Text style={styles.barPercent}>{item.percent}%</Text>
        </View>
      ))}

      {/* 확장 내용 */}
      {textBoxHeight === 412 && (
        <View style={styles.expandedSection}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 8 }}
            showsVerticalScrollIndicator={false}
          >
            {expandedNotice.map((item, i) => (
              <View key={i}>
                <View style={styles.keywordRow}>
                  {item.a.split(" ").map((word, idx) => (
                    <Text
                      key={idx}
                      style={[
                        styles.keywordText,
                        /\d+%/.test(word) && styles.keywordHighlight,
                      ]}
                    >
                      {word + " "}
                    </Text>
                  ))}
                </View>
                <Text style={styles.detailText}>{item.b}</Text>
                <Text style={styles.detailText}>{item.c}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 화살표 버튼 */}
      <TouchableOpacity
        style={[
          styles.arrowBtn,
          { marginTop: textBoxHeight === 412 ? 8 : "auto" },
        ]}
        onPress={toggleTextHeight}
        activeOpacity={0.7}
      >
        <Image
          source={
            textBoxHeight === 227
              ? require("../../assets/icons/arow.png")
              : require("../../assets/icons/main_arrow.png")
          }
          style={styles.arrowImage}
        />
      </TouchableOpacity>
    </View>
  );
}

export default MainFeedback;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    flexDirection: "column",
    alignItems: "stretch",
    paddingHorizontal: "4%",
    paddingVertical: "3%",
    marginTop: "10%",
    marginBottom: "10%",
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 32,
    marginTop: "3%",
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: "4%",
  },
  title: {
    fontSize: 16,
    color: "#191919",
    lineHeight: 20,
    fontWeight: "600",
    textAlign: "left",
  },
  date: {
    fontSize: 12,
    fontWeight: "400",
    color: "#191919",
    marginLeft: "3%",
    lineHeight: 34,
  },
  rightTime: {
    fontSize: 12,
    fontWeight: "400",
    color: "#808080",
    lineHeight: 34,
    textAlign: "right",
    marginRight: "2%",
    minWidth: 50,
  },
  barRow: {
    width: "95%",
    marginTop: "6%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  barLabel: {
    marginRight: "3%",
    minWidth: 65,
    width: "10%",
  },
  barWrapper: {
    flex: 1,
    marginHorizontal: "2%",
  },
  barPercent: {
    marginRight: "-1%",
    minWidth: 50,
    textAlign: "right",
  },
  barContainer: {
    width: "100%",
    overflow: "hidden",
    justifyContent: "center",
  },
  expandedSection: {
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    justifyContent: "flex-start",
  },
  keywordRow: {
    marginTop: 47,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  keywordText: {
    color: "#808080",
    fontWeight: "100",
    fontSize: 13,
    lineHeight: 20,
    marginRight: 6,
  },
  keywordHighlight: {
    color: "#5900FF",
    fontWeight: "600",
  },
  detailText: {
    margin: 10,
    textAlign: "left",
    color: "#191919",
    fontWeight: "300",
    fontSize: 14,
    lineHeight: 20,
    flexWrap: "wrap",
    fontStyle: "normal",
    letterSpacing: -0.84,
  },
  arrowBtn: {
    alignSelf: "center",
  },
  arrowImage: {
    width: 40,
    height: 17,
    alignSelf: "center",
  },
});
