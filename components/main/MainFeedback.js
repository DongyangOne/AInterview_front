import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RoundedBar from "./RoundedBar";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const dateObj = new Date(dateStr);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

const getTimes = (apiDate) => {
  const now = new Date();
  const date = new Date(apiDate);
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.floor(diffMs / 1000 / 60);

  if (minutes <= 1) {
    return "방금 전";
  } else if (minutes < 60) {
    return `${minutes}분 전`;
  } else if (minutes < 60 * 24) {
    const hours = Math.floor(minutes / 60);
    return `${hours}시간 전`;
  } else if (minutes < 60 * 24 * 30) {
    const days = Math.floor(minutes / 60 / 24);
    return `${days}일 전`;
  } else if (minutes < 60 * 24 * 30 * 12) {
    const month = Math.floor(minutes / 60 / 24 / 30);
    return `${month}달 전`;
  } else {
    const years = Math.floor(minutes / 60 / 24 / 365);
    return `${years}년 전`;
  }
};

function MainFeedback() {
  const [shouldScroll, setShouldScroll] = useState(false);
  const scrollRef = useRef(null);
  const [textBoxHeight, setTextBoxHeight] = useState(227);
  const [feedback, setFeedback] = useState([]);
  const [fetime, setFetime] = useState("");
  const [feedtitle, setFeedTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersId = await AsyncStorage.getItem("userId");
        const res = await axios
          .get(`${process.env.EXPO_PUBLIC_API_URL}/mainpage/feedback`, {
            params: { userId: usersId },
          })
          .then((res) => {
            if (res.data && res.data.success) {
              const firstData = res.data.data[0];
              setFeedback(res.data.data);
              setFetime(formatDate(firstData.created_at));
              setFeedTitle(firstData.title);
              console.log("메인피드백", res.data.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };
    fetchData();
  }, []);

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
  const firstfb = feedback?.[0];
  return firstfb ? (
    <View style={[styles.container, { minHeight: textBoxHeight }]}>
      {/* 헤더 영역 */}
      <View style={styles.headerRow}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{feedtitle ? feedtitle : "로딩 중"}</Text>
          <Text style={styles.date}>{fetime ? fetime : "로딩 중"}</Text>
        </View>
        <Text style={styles.rightTime}>
          {firstfb?.created_at ? getTimes(firstfb.created_at) : "로딩 중"}
        </Text>
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
            ref={scrollRef}
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
                <Text style={styles.detailText}>
                  {firstfb?.content ? firstfb.content : "로딩 중"}
                </Text>
                {/**아직 해당 db에 값이 없어서 임시 출력 */}
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
  ) : (
    <View style={[styles.container, { minHeight: textBoxHeight }]}>
      {/* 화살표 버튼 */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: "#191919" }}>
          최근 피드백이 없습니다.
        </Text>
      </View>
    </View>
  );
}

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

export default MainFeedback;
