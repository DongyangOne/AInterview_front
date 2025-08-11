import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Image, FlatList, Pressable, Alert,
} from "react-native";
import { useMemo, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AlignModal from "../../components/Modal/AlignModal";
import EditListModal from "../../components/Modal/EditListModal";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

//const USER_ID = "1"; // 고정

export default function Feedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("basic");
  const [openModalItemId, setOpenModalItemId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const route = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
//        const userId = await AsyncStorage.getItem("userId");
        const userId = 1;
        if (!userId) {
          console.log("userId가 저장되어 있지 않습니다.");
          return;
        }
        const res = await fetch(`${API_URL}/feedback/${userId}`);
        const data = await res.json();

        const mappedData = data.data.map(item => ({
          id: item.notice_id.toString(),
          date: new Date(item.created_at).toLocaleDateString("ko-KR"),
          title: item.title,
          memo: item.content,
          pin: item.is_read === "N" ? "Y" : "N",
        }));

        setFeedbackList(mappedData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);
const filteredList = useMemo(() => {
  if (!searchText.trim()) return feedbackList;

  const lowerSearch = searchText.trim().toLowerCase();
const normalize = str => str.trim().toLowerCase();


  return feedbackList.filter(item => {
      return (
        normalize(item.title).includes(lowerSearch) ||
        item.date.includes(lowerSearch)
      );
    });
  }, [searchText, feedbackList]);


  const sortedList = useMemo(() => {
    const listToSort = filteredList;

    return [...listToSort].sort((a, b) => {
      if (a.pin === "Y" && b.pin !== "Y") return -1;
      if (a.pin !== "Y" && b.pin === "Y") return 1;

      return new Date(b.date) - new Date(a.date);
    });
  }, [filteredList]);


  // PATCH: pin / unpin
  const togglePin = async (item) => {
    const willPin = item.pin !== "Y";
//    const userId = await AsyncStorage.getItem("userId");
    const userId = "1";
    const url = willPin
      ? `${API_URL}/feedback/pin/${userId}/${item.id}`
      : `${API_URL}/feedback/unpin/${userId}/${item.id}`;

    try {
      setLoadingId(item.id);

      // UI 즉시 업데이트
      setFeedbackList(prev =>
        prev.map(v => (v.id === item.id ? { ...v, pin: willPin ? "Y" : "N" } : v))
      );

      const res = await axios.patch(url);  // 여기 한 번만 호출


      console.log("서버 응답:", res.data);

      if (!res?.data?.success) {
        // 실패 시 롤백
        setFeedbackList(prev =>
          prev.map(v => (v.id === item.id ? { ...v, pin: item.pin } : v))
        );
        Alert.alert("실패", res?.data?.message || "요청을 처리하지 못했습니다.");
      }
    } catch (e) {
      // 롤백
      setFeedbackList(prev =>
        prev.map(v => (v.id === item.id ? { ...v, pin: item.pin } : v))
      );
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
        <TextInput style={styles.searchInput} placeholder="제목, 날짜, 메모 검색"
         value={searchText}
           onChangeText={setSearchText}
/>
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
        {open ? <AlignModal setOpen={setOpen} setMode={mode}/> : null}
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
                  <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
                    <EditListModal
                      item={item}
                      setOpenModalItemId={setOpenModalItemId}
                      isModalVisible={isModalVisible}
                      isPinned={isPinned}
                      onTogglePin={() => togglePin(item)}
                    />
                  </View>
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
  container: { flex: 1, backgroundColor: "white", paddingHorizontal: 32, },
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
