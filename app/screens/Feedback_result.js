// Feedback_result.js
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feedback_resultModal from "../../components/Modal/Feedback_resultModal";
import RadarChart from "../../components/Modal/RadarChart";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const LABELS_KO = {
  pose: "자세",
  confidence: "자신감",
  facial: "표정",
  risk_response: "위기 대처능력",
  tone: "말투",
  understanding: "업무이해도",
};

export default function FeedbackResult() {
  const route = useRouter();

  const [memo, setMemo] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [tip, setTip] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [scores, setScores] = useState({
    pose: 0,
    confidence: 0,
    facial: 0,
    risk_response: 0,
    tone: 0,
    understanding: 0,
  });

  // 🔹 제목 줄 수 추적(기본 1줄)
  const [titleLineCount, setTitleLineCount] = useState(1);

  // 로딩/에러
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const params = useLocalSearchParams();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
  const feedbackId = Array.isArray(params.feedbackId) ? params.feedbackId[0] : params.feedbackId;
  const title = Array.isArray(params.title) ? params.title[0] : params.title;

  const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || "",
    timeout: 15000,
  });

  useEffect(() => {
    if (!userId || !feedbackId) return;

    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(
          `/feedback/${encodeURIComponent(userId)}/${encodeURIComponent(feedbackId)}`
        );
        const data = res.data?.data || {};

        if (data.created_at) {
          const date = new Date(data.created_at);
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const d = String(date.getDate()).padStart(2, "0");
          const formatted = `${y}년 ${m}월 ${d}일`;
          setCreatedAt(formatted);
        }

        // 응답 값 매핑
        setPros(data.good || "");
        setCons(data.bad || "");
        setTip(data.content || "");
        setMemo(data.memo || "");
        setIsPinned((data.pin || "N") === "Y");
        setScores({
          pose: data.pose || 0,
          confidence: data.confidence || 0,
          facial: data.facial || 0,
          risk_response: data.risk_response || 0,
          tone: data.tone || 0,
          understanding: data.understanding || 0,
        });
      } catch (e) {
        setError("피드백을 불러오지 못했어요.");
        console.warn(e?.response?.data || e?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [userId, feedbackId]);

  const bestAspectKey = useMemo(() => {
    const entries = Object.entries(scores);
    if (!entries.length) return "pose";
    let maxKey = "pose";
    let maxVal = -Infinity;
    for (const [k, v] of entries) {
      if (typeof v === "number" && v > maxVal) {
        maxVal = v;
        maxKey = k;
      }
    }
    return maxKey;
  }, [scores]);

  const bestAspectLabel = LABELS_KO[bestAspectKey] || "자세";

  // 🔹 제목 lineHeight(아래 style과 동일 값)
  const TITLE_LINE_HEIGHT = 22;
  // 🔹 북마크 top: 기본 125 + (줄바꿈 수 * lineHeight)
  const bookmarkTop = 125 + Math.max(0, titleLineCount - 1) * TITLE_LINE_HEIGHT;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 0 }}>
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => route.replace("/feedback")}>
            <Image
              source={require("../../assets/icons/arrow.png")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>피드백 상세</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={require("../../assets/icons/dots.png")}
              style={styles.dotsIcon}
            />
          </TouchableOpacity>
        </View>

        {/* 제목(좌 65% - 자동 줄바꿈) + 날짜(우 35% - 우측 하단 고정) */}
        <View style={styles.headerGrid}>
          <View style={styles.headerLeft}>
            <Text
              style={styles.topTitleWrap}
              // 🔹 실제 렌더링된 줄 수를 받아서 상태에 반영
              onTextLayout={(e) => {
                const lines = e?.nativeEvent?.lines?.length ?? 1;
                setTitleLineCount(lines);
              }}
            >
              {title || "피드백"}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.date}>{createdAt || "날짜 없음"}</Text>
          </View>
        </View>

        {isPinned && (
          <Image
            source={require("../../assets/icons/bookmark.png")}
            // 🔹 제목이 줄바꿈되면(top 증가) 그만큼만 자동으로 아래로 이동
            style={{
              position: "absolute",
              right: 18,
              top: bookmarkTop,
              width: 50,
              height: 70,
              zIndex: 1,
              elevation: 30,
            }}
          />
        )}
      </View>

      <View style={styles.fullLine} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.graphTitle}>사용자 분석 그래프</Text>
          <RadarChart data={scores} />

          {/*저번보다 OO이(가) 더 좋아졌어요! text style : improvementText*/}

          <Text style={styles.feedbackTitle}>피드백 및 평가</Text>

          <Text style={styles.labelGood}>장점</Text>
          <Text style={styles.bodyText}>
            {loading
              ? "불러오는 중..."
              : error
              ? "장점을 표시할 수 없어요."
              : pros?.trim()
              ? pros
              : "장점 데이터가 없습니다."}
          </Text>

          <Text style={styles.labelBad}>단점</Text>
          <Text style={styles.bodyText}>
            {loading
              ? "불러오는 중..."
              : error
              ? "단점을 표시할 수 없어요."
              : cons?.trim()
              ? cons
              : "단점 데이터가 없습니다."}
          </Text>

          <Text style={styles.labelTip}>피드백</Text>
          <Text style={styles.bodyText}>
            {loading
              ? "불러오는 중..."
              : error
              ? "피드백을 표시할 수 없어요."
              : tip?.trim()
              ? tip
              : "피드백 데이터가 없습니다."}
          </Text>

          <Text style={styles.memoTitle}>메모</Text>
          <TextInput
            style={[styles.memoInput, styles.memoReadOnly]}
            multiline
            placeholder="메모가 없습니다."
            value={memo}
            editable={false}
            selectTextOnFocus={false}
            showSoftInputOnFocus={false}
            underlineColorAndroid="transparent"
          />
        </View>
      </ScrollView>

      {modalVisible && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            elevation: 9999,
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
          />

          <View style={{ position: "absolute", top: 20, right: 0 }}>
            <Feedback_resultModal
              item={{ id: feedbackId, title, memo }}
              setOpenModalItemId={() => setModalVisible(false)}
              isModalVisible={modalVisible}
              isPinned={isPinned}
              onUpdateTitle={(id, newTitle) => route.setParams({ title: newTitle })}
              onUpdateMemo={(id, newMemo) => setMemo(newMemo)}
              onDelete={(id) => route.replace("/feedback")}
              onPin={(_id, newPin) => setIsPinned(newPin === "Y")}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingTop: 10,
    paddingBottom: 22,
    paddingHorizontal: 0,
    backgroundColor: "#fff",
  },
  arrowIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#191919",
    fontFamily: "Pretendard",
  },
  dotsIcon: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },

  /** ⬇️ 2-칼럼 헤더: 제목(좌) + 날짜(우 하단) */
  headerGrid: {
    flexDirection: "row",
    // 두 칼럼 높이를 가장 긴 쪽에 맞춤 → 오른쪽을 하단 정렬 가능
    alignItems: "stretch",
    marginTop: 30,
    width: "100%",
  },
  headerLeft: {
    width: "65%",
    paddingRight: 8,
    alignSelf: "stretch",
  },
  headerRight: {
    width: "35%",
    alignItems: "flex-end",   // 가로: 오른쪽
    justifyContent: "flex-end", // 세로: 하단
    alignSelf: "stretch",
  },

  /** 제목: ‘중간 정도’ 크기 + 줄바꿈 허용 */
  topTitleWrap: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    fontFamily: "Pretendard",
    color: "#191919",
  },

  /** 날짜: 우측 하단 고정 */
  date: {
    fontSize: 14,
    fontWeight: "300",
    fontFamily: "Pretendard",
    color: "#808080",
  },

  fullLine: {
    height: 5,
    backgroundColor: "#DDDDDD",
    width: "100%",
    alignSelf: "center",
    marginTop: 7,
    borderRadius: 3,
    elevation: 0,
    zIndex: 0,
  },

  graphTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "300",
    fontFamily: "Pretendard",
    color: "#191919",
    marginTop: 35,
    marginBottom: 16,
  },
  improvementText: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#808080",
    fontFamily: "Pretendard",
    marginBottom: 60,
  },
  highlight: { color: "#5900FF" },
  feedbackTitle: {
    marginTop: 36,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "400",
    color: "#191919",
    fontFamily: "Pretendard",
  },
  labelGood: {
    marginTop: 24,
    color: "#A495CF",
    fontWeight: "600",
    fontFamily: "Pretendard",
  },
  labelBad: {
    marginTop: 24,
    color: "#A495CF",
    fontWeight: "600",
    fontFamily: "Pretendard",
  },
  labelTip: {
    marginTop: 24,
    color: "#A495CF",
    fontWeight: "600",
    fontFamily: "Pretendard",
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    fontFamily: "Pretendard",
    marginTop: 6,
  },
  memoTitle: {
    marginTop: 61,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: "Pretendard",
  },
  memoInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    minHeight: 100,
    marginTop: 17,
    textAlignVertical: "top",
    fontFamily: "Pretendard",
    marginBottom: 104,
  },
});
