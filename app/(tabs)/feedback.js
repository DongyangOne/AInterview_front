import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { useMemo, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AlignModal from "../../components/Modal/AlignModal";
import EditListModal from "../../components/Modal/EditListModal";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        const usersId = await AsyncStorage.getItem("userId");

        console.log(usersId);
        if (!usersId) {
          console.log("userId가 저장되어 있지 않습니다.");
          return;
        }

        if (usersId !== null) {
          await axios
            .get(`${process.env.EXPO_PUBLIC_API_URL}/feedback/${usersId}`)
            .then(async (res) => {
              const data = res.data;

              const mappedData = data.data.map((item) => ({
                id: item.id.toString(),
                date: new Date(item.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
                title: item.title,
                memo: item.memo,
                pin: item.pin || "N",
              })

              );


              setFeedbackList(mappedData);
            })
            .catch((err) => {
              console.error("조회 실패.", err);
            })
        }


      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const filteredList = useMemo(() => {
    if (!searchText.trim()) return feedbackList;

    const lowerSearch = searchText.trim().toLowerCase();
    const normalize = (str) => str.trim().toLowerCase();

    return feedbackList.filter((item) => {
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

      if (mode === "date") {
        return new Date(a.date) - new Date(b.date);
      } else if (mode === "alphabet") {
        return a.title.localeCompare(b.title, "ko");
      }


      return new Date(a.date) - new Date(b.date);
    });
  }, [filteredList, mode]);





  const handleSortByDate = () => setMode("date");
  const handleSortByAlphabet = () => setMode("alphabet");

  const handleUpdateTitle = (id, newTitle) => {
    setFeedbackList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, title: newTitle } : item
      )
    );
  };





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
          value={searchText}
          onChangeText={setSearchText}
        />
        <Image
          source={require("../../assets/icons/search.png")}
          style={{ width: 24, height: 24 }}
        />
      </View>

      <View style={styles.wrapFilter}>
        <Text style={{ fontSize: 15, color: "#808080" }}>모든 피드백</Text>
        <Pressable
          onPress={() => setOpen(!open)}
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
        {open ? <AlignModal
          setOpen={setOpen}
          onSortByDate={handleSortByDate}
          onSortByAlphabet={handleSortByAlphabet}
        /> : null}
      </View>

      <FlatList
        data={sortedList}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        CellRendererComponent={(props) => {
          const { index, style, children, ...rest } = props;
          const item = sortedList[index];
          const isOpen = item?.id === openModalItemId;

          return (
            <View
              {...rest}
              style={[
                style,
                {
                  zIndex: isOpen ? 10000 : 0,
                  elevation: isOpen ? 10000 : 0,
                  overflow: "visible",
                },
              ]}
            >
              {children}
            </View>
          );
        }}
        renderItem={({ item }) => {
          const isModalVisible = openModalItemId === item.id;
          const isPinned = item.pin === "Y";

          return (
            <Pressable
              onPress={() => route.push("/screens/FeedbackDetail")}
              style={[
                styles.contentBox,
                {
                  position: "relative",
                  overflow: "visible",
                  zIndex: isModalVisible ? 9999 : 0,
                  elevation: isModalVisible ? 9999 : 0,
                },
              ]}
            >
              {isPinned && (
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
                  onPress={() =>
                    setOpenModalItemId(isModalVisible ? null : item.id)
                  }
                  disabled={loadingId === item.id}
                >
                  <Image
                    source={require("../../assets/icons/dot.png")}
                    style={{ width: 24, height: 24 }}
                  />
                </TouchableOpacity>

                {isModalVisible ? (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 10000,
                      elevation: 10000,
                      overflow: "visible",
                    }}
                    pointerEvents="box-none"
                  >
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 1,
                        zIndex: 10000,
                        elevation: 10000,
                        overflow: "visible",
                      }}
                    >
                      <EditListModal
                        item={item}
                        setOpenModalItemId={setOpenModalItemId}
                        isModalVisible={isModalVisible}
                        onUpdateTitle={handleUpdateTitle}
                      />
                    </View>
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
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 32,
    zIndex: 20000,
  },
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
  fontTw1: { marginTop: 24, marginLeft: 17, fontSize: 14, color: "#808080" },
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
