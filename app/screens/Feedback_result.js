import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,ScrollView,Dimensions} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const today = new Date();
const formattedDate = today
  .toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  .replace(/\. /g, ".")
  .replace(/\.$/, "");

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function FeedbackResult() {
  const route = useRouter();

  // 메모
  const [memo, setMemo] = useState("");

  // 장점/단점/피드백 상태
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [tip, setTip] = useState("");

  // 로딩/에러
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // /feedback/[userId]/[feedbackId] 경로 파라미터
  const params = useLocalSearchParams();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
  const feedbackId = Array.isArray(params.feedbackId) ? params.feedbackId[0] : params.feedbackId;
  const title = Array.isArray(params.title) ? params.title[0] : params.title;

  // axios 인스턴스 (env 사용)
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
        )
        .then((r) => {
            console.log("가져온 데이터",{
                userId,
                feedbackId,
                title,
                status: r?.status,
            });
            return r;
        });
        const data = res.data?.data || {};

        // 응답 값 매핑
        setPros(data.good || "");
        setCons(data.bad || "");
        setTip(data.content || "");
        setMemo(data.memo || "");
      } catch (e) {
        setError("피드백을 불러오지 못했어요.");
        console.warn(e?.response?.data || e?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [userId, feedbackId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 0 }}>
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => route.replace('/feedback')}>
            <Image
              source={require("../../assets/icons/arrow.png")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>피드백 상세</Text>
          <TouchableOpacity onPress={() => {}}>
            <Image
              source={require("../../assets/icons/dots.png")}
              style={styles.dotsIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.headerRow}>
          {/* 제목 */}
          <Text style={styles.topTitle}>{title || "피드백"}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>

      <View style={styles.fullLine} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.graphTitle}>사용자 분석 그래프</Text>
          <View style={styles.graphWrapper}>
            <Image
              source={require("../../assets/images/feedbackresult.png")}
              style={styles.graphImage}
            />
            <Text style={[styles.graphLabel, styles.labelTopLeft]}>자세</Text>
            <Text style={[styles.graphLabel, styles.labelTopRight]}>자신감</Text>
            <Text style={[styles.graphLabel, styles.labelLeft]}>표정</Text>
            <Text style={[styles.graphLabel, styles.labelRight]}>
              위기 대처{"\n"}능력
            </Text>
            <Text style={[styles.graphLabel, styles.labelBottomLeft]}>말투</Text>
            <Text style={[styles.graphLabel, styles.labelBottomRight]}>
              업무이해도
            </Text>
          </View>

          <Text style={styles.improvementText}>
            저번보다 <Text style={styles.highlight}>자세</Text>가 더 좋아졌어요!
          </Text>

          <Text style={styles.feedbackTitle}>피드백 및 평가</Text>

          {/* 장점 */}
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

          {/* 단점 */}
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

          {/* 피드백 */}
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
            style={styles.memoInput}
            multiline
            placeholder="메모를 입력하세요..."
            value={memo}
            onChangeText={setMemo}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => route.replace("/home")}
            >
              <Text style={styles.deleteButtonText}>피드백 삭제</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => route.push("/feedback")}
            >
              <Text style={styles.saveButtonText}>피드백 저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 32,
    paddingTop: 0,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingBottom: 12,
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
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  fullLine: {
    height: 2,
    backgroundColor: "#DDDDDD",
    width: "100%",
    alignSelf: "center",
    marginTop: 7,
    marginBottom: 55,
    borderRadius: 3,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Pretendard",
    color: "#191919",
  },
  date: {
    fontSize: 18,
    fontWeight: "300",
    fontFamily: "Pretendard",
    color: "#808080",
  },
  graphTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "300",
    fontFamily: "Pretendard",
    color: "#191919",
    marginBottom: 56,
  },
  graphWrapper: {
    width: 206,
    height: 206,
    alignSelf: "center",
    position: "relative",
    marginBottom: 10,
  },
  graphImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  graphLabel: {
    position: "absolute",
    fontSize: 13,
    fontFamily: "Pretendard",
    color: "#191919",
    fontWeight: "400",
  },
  labelTopLeft: { top: -18, left: 38 },
  labelTopRight: { top: -18, right: 30 },
  labelLeft: { top: "42%", left: -40 },
  labelRight: { top: "42%", right: -70, width: 68, textAlign: "center" },
  labelBottomLeft: { bottom: -16, left: 40 },
  labelBottomRight: { bottom: -16, right: 10 },
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
    marginTop: 32,
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
    marginTop: 12,
    textAlignVertical: "top",
    fontFamily: "Pretendard",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 40,
  },
  deleteButton: {
    flex: 1,
    marginRight: 12,
    backgroundColor: "#FFFFFF",
    borderColor: "#191919",
    borderWidth: 0.3,
    borderRadius: 10,
    paddingVertical: 14,
  },
  saveButton: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: "#191919",
    borderRadius: 10,
    paddingVertical: 14,
  },
  deleteButtonText: {
    color: "#808080",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Inter",
    letterSpacing: -0.5,
  },
  saveButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Inter",
    letterSpacing: -0.5,
  },
});
