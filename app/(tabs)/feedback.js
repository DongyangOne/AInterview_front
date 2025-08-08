import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AlignModal from "../../components/Modal/AlignModal";
import EditListModal from "../../components/Modal/EditListModal";
import { useRouter } from "expo-router";

export default function Feedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModalItemId, setOpenModalItemId] = useState(null);
  const route = useRouter();

  useEffect(() => {
    fetch("http://183.101.17.181:3001/feedback/1")
      .then(res => res.json())
      .then(data => {
        const mappedData = data.data.map(item => ({
          id: item.notice_id.toString(),
          date: new Date(item.created_at).toLocaleDateString("ko-KR"),
          title: item.title,
          memo: item.content,
          pin: item.is_read === "N" ? "Y" : "N",
        }));
        setFeedbackList(mappedData);
      })
      .catch(err => console.error(err));
  }, []);

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
        <Pressable
          onPress={() => {
            setOpen(!open);
          }}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text style={{ fontSize: 15 }}>정렬기준</Text>
          <Image
            style={{ width: 28, height: 14 }}
            source={
              open
                ? require("../../assets/icons/arrow_down.png")
                : require("../../assets/icons/arrow_up.png")
            }
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

          return (
            <Pressable
              onPress={() => route.push("/screens/FeedbackDetail")}
              style={[styles.contentBox, { position: "relative" }]}
            >
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
                    setOpenModalItemId(isModalVisible ? null : item.id);
                  }}
                >
                  <Image
                    source={require("../../assets/icons/dot.png")}
                    style={{ width: 24, height: 24 }}
                  />
                </TouchableOpacity>

                {isModalVisible ? (
                  <EditListModal setOpenModalItemId={setOpenModalItemId} />
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
    marginBottom: 10,
    marginTop: 10,
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