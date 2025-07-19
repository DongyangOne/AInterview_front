import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
const feedbackList = [
  {
    id: "1",
    date: "2025년 6월 27일",
    title: "삼성 회사 면접",
    memo: "앞으로 자신감, 위기대처능력, 업무이...",
    pin: "Y",
  },
  {
    id: "2",
    date: "2025년 5월 13일",
    title: "LG 1차 면접",
    memo: "침착하고 간결한 말투 필요",
    pin: "N",
  },
  {
    id: "3",
    date: "2025년 6월 27일",
    title: "삼성 회사 면접",
    memo: "앞으로 자신감, 위기대처능력, 업무이...",
    pin: "Y",
  },
  {
    id: "4",
    date: "2025년 5월 13일",
    title: "LG 1차 면접",
    memo: "침착하고 간결한 말투 필요",
    pin: "N",
  },
  {
    id: "5",
    date: "2025년 5월 13일",
    title: "LG 1차 면접",
    memo: "침착하고 간결한 말투 필요",
    pin: "N",
  },
  {
    id: "6",
    date: "2025년 6월 27일",
    title: "삼성 회사 면접",
    memo: "앞으로 자신감, 위기대처능력, 업무이...",
    pin: "Y",
  },
];

export default function Feedback() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("basic");
  const [items, setItems] = useState([
    { label: "정렬 기준", value: "basic" },
    { label: "최근 날짜 순", value: "latest" },
    { label: "가나다 순", value: "name" },
  ]);

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [value1, setValue1] = useState("basic");
  const [items1, setItems1] = useState([
    { label: "정렬 기준", value: "basic" },
    { label: "최상단 고정", value: "static" },
    { label: "제목 수정", value: "title" },
    { label: "메모 수정", value: "memo" },
    { label: "기록 삭제", value: "delete" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // 'title', 'memo', 'delete'

  const sortedList = [...feedbackList].sort((a, b) => {
    if (a.pin === "Y" && b.pin !== "Y") return -1;
    if (a.pin !== "Y" && b.pin === "Y") return 1;

    // 날짜 내림차순
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <Text style={{ fontSize: 20, fontWeight: "500" }}>
          나의 피드백 목록
        </Text>
      </View>
      <View style={styles.search}>
        <TextInput
          style={styles.searchInput}
          placeholder="제목, 날짜, 메모 검색"
        />
        <Image
          source={require("../../assets/icons/search.png")}
          style={{ width: 24, height: 24 }}
        />
      </View>
      <View style={styles.wrapFilter}>
        <Text
          style={{
            fontSize: 15,
            color: "#808080",
          }}
        >
          모든 피드백
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 15 }}>정렬기준</Text>
          <Image
            style={{ width: 28, height: 14 }}
            source={require("../../assets/icons/arrow_down.png")}
          />
        </View>
      </View>
      <FlatList
        data={sortedList}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<View style={styles.empty} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.contentBox, { position: "relative" }]}>
            {item.pin === "Y" && (
              <Image
                source={require("../../assets/icons/bookmark.png")}
                style={{
                  width: 50,
                  height: 50,
                  marginLeft: 270,
                  top: -12,
                  position: "absolute",
                }}
              />
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.fontTw1}>{item.date}</Text>
              <TouchableOpacity
                style={{ top: 20, right: 14 }}
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <Image
                  source={require("../../assets/icons/dot.png")}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.fontTw2}>{item.title}</Text>
              <Text style={styles.fontTw3}>{item.memo}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 32,
  },
  head: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
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
  searchInput: {
    height: 50,
    fontSize: 15,
  },
  wrapFilter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 35,
    marginBottom: 10,
  },
  contentBox: {
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#cccccc",
    width: "100%",
    height: 135,
    marginBottom: 20,
    backgroundColor: "white",
  },
  fontTw1: {
    marginTop: 24,
    marginLeft: 17,
    fontSize: 14,
    color: "#808080",
  },
  fontTw2: {
    fontSize: 18,
    marginTop: 15,
    marginLeft: 17,
    marginBottom: 10,
    fontWeight: "600",
  },
  fontTw3: {
    fontSize: 15,
    marginLeft: 17,
    marginBottom: 10,
    bottom: 5,
    color: "#808080",
  },
});
