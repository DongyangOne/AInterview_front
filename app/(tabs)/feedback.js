import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Image, FlatList, Pressable, Alert,
} from "react-native";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AlignModal from "../../components/Modal/AlignModal";
import EditListModal from "../../components/Modal/EditListModal";
import { useRouter } from "expo-router";
import axios from "axios";

const USER_ID = "1"; // 고정

// 초기 데이터
const feedbackList = [
  { id: "1", date: "2025년 6월 27일", title: "삼성 회사 면접", memo: "앞으로 자신감, 위기대처능력, 업무이...", pin: "Y" },
  { id: "2", date: "2025년 5월 13일", title: "LG 1차 면접", memo: "침착하고 간결한 말투 필요", pin: "N" },
  { id: "3", date: "2025년 6월 27일", title: "삼성 회사 면접", memo: "앞으로 자신감, 위기대처능력, 업무이...", pin: "Y" },
  { id: "4", date: "2025년 5월 13일", title: "LG 1차 면접", memo: "침착하고 간결한 말투 필요", pin: "N" },
  { id: "5", date: "2025년 5월 13일", title: "LG 1차 면접", memo: "침착하고 간결한 말투 필요", pin: "N" },
  { id: "6", date: "2025년 6월 27일", title: "삼성 회사 면접", memo: "앞으로 자신감, 위기대처능력, 업무이...", pin: "Y" },
];

// "2025년 6월 27일" → Date
const toDate = (k) => {
  const m = (k || "").match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (!m) return new Date(k);
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
  return new Date(y, mo - 1, d);
};

export default function Feedback() {
  const [open, setOpen] = useState(false);
  const [openModalItemId, setOpenModalItemId] = useState(null);
  const [list, setList] = useState(feedbackList); // <-- state로 관리
  const [loadingId, setLoadingId] = useState(null);
  const route = useRouter();

  // Y 먼저 + 날짜 내림차순
  const sortedList = useMemo(() => {
    return [...list].sort((a, b) => {
      if (a.pin === "Y" && b.pin !== "Y") return -1;
      if (a.pin !== "Y" && b.pin === "Y") return 1;
      return toDate(b.date) - toDate(a.date);
    });
  }, [list]);

  // PATCH: pin / unpin
  const togglePin = async (item) => {
    const willPin = item.pin !== "Y";
    const url = willPin
      ? `http://183.101.17.181:3001/feedback/pin/${USER_ID}/${item.id}`
      : `http://183.101.17.181:3001/feedback/unpin/${USER_ID}/${item.id}`;

    try {
      setLoadingId(item.id);

      // 낙관적 업데이트 (아이콘/정렬 즉시 반영)
      setList(prev => prev.map(v => v.id === item.id ? { ...v, pin: willPin ? "Y" : "N" } : v));

      const res = await axios.patch(url);
      if (!res?.data?.success) {
        // 실패 시 롤백
        setList(prev => prev.map(v => v.id === item.id ? { ...v, pin: item.pin } : v));
        Alert.alert("실패", res?.data?.message || "요청을 처리하지 못했습니다.");
      }
    } catch (e) {
      // 롤백
      setList(prev => prev.map(v => v.id === item.id ? { ...v, pin: item.pin } : v));
      Alert.alert("네트워크 오류", "잠시 후 다시 시도해 주세요.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <Text style={{ fontSize: 20, fontWeight: "500" }}>나의 피드백 목록</Text>
      </View>

      <View style={styles.search}>
        <TextInput style={styles.searchInput} placeholder="제목, 날짜, 메모 검색" />
        <Image source={require("../../assets/icons/search.png")} style={{ width: 24, height: 24 }} />
      </View>

      <View style={styles.wrapFilter}>
        <Text style={{ fontSize: 15, color: "#808080" }}>모든 피드백</Text>
        <Pressable onPress={() => setOpen(!open)} style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 15 }}>정렬기준</Text>
          <Image
            style={{ width: 28, height: 14 }}
            source={open ? require("../../assets/icons/arrow_down.png") : require("../../assets/icons/arrow_up.png")}
          />
        </Pressable>
        {open ? <AlignModal setOpen={setOpen} /> : null}
      </View>

      <FlatList
        data={sortedList}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isModalVisible = openModalItemId === item.id;
          const isPinned = item.pin === "Y";

          return (
            <Pressable
              onPress={() => route.push("/screens/FeedbackDetail")}
              style={[styles.contentBox, { position: "relative" }]}
            >
              {/* 보라색 저장 아이콘: pin일 때만 표시 */}
              {isPinned && (
                <Image
                  source={require("../../assets/icons/bookmark.png")}
                  style={{ width: 50, height: 50, marginLeft: 270, top: -12, position: "absolute" }}
                />
              )}

              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.fontTw1}>{item.date}</Text>

                <TouchableOpacity
                  style={{ top: 20, right: 14 }}
                  onPress={() => setOpenModalItemId(isModalVisible ? null : item.id)}
                  disabled={loadingId === item.id}
                >
                  <Image source={require("../../assets/icons/dot.png")} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>

                {isModalVisible ? (
                  <EditListModal
                    item={item.id}
                    setOpenModalItemId={setOpenModalItemId}
                    isModalVisible={isModalVisible}
                    isPinned={isPinned}                   // <-- 추가
                    onTogglePin={() => togglePin(item)}   // <-- 추가
                  />
                ) : null}
              </View>

              <View>
                <Text style={styles.fontTw2}>{item.title}</Text>
                <Text style={styles.fontTw3}>{item.memo}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingHorizontal: 32 },
  head: { height: 60, alignItems: "center", justifyContent: "center" },
  search: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#cccccc",
    height: 50,
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 12,
  },
  searchInput: { height: 50, fontSize: 15 },
  wrapFilter: { flexDirection: "row", justifyContent: "space-between", marginTop: 35, marginBottom: 10 },
  contentBox: {
    borderRadius: 10, borderWidth: 0.5, borderColor: "#cccccc",
    width: "100%", height: 135, marginBottom: 10, marginTop: 10, backgroundColor: "white",
  },
  fontTw1: { marginTop: 24, marginLeft: 17, fontSize: 14, color: "#808080" },
  fontTw2: { fontSize: 18, marginTop: 15, marginLeft: 17, marginBottom: 10, fontWeight: "600" },
  fontTw3: { fontSize: 15, marginLeft: 17, marginBottom: 10, bottom: 5, color: "#808080" },
});
