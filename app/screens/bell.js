import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Bell() {
  const router = useRouter();
  const [notis, setNotis] = useState([]);
  const [time, setTime] = useState();
  const apiTime = new Date(time);
  const [getNoticeid, setGetNoticeid] = useState("");
  const [usersId, setUsersId] = useState("");
  useEffect(() => {
    const bellData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (!storedUserId) {
          console.log("userId 없음");
          return;
        }
        setUsersId(storedUserId); // 화면/UI 상태 업데이트용
        console.log("API 호출 userId:", storedUserId);
        await axios
          .get(`${process.env.EXPO_PUBLIC_API_URL}/notice/${storedUserId}`)
          .then(async (res) => {
            console.log(res.data);
            if (res.data && res.data.success) {
              setTime(res.data.created_at);
              const newNotis = res.data.data || [];
              const unreadNotis = newNotis.filter((n) => n.is_read === "N");
              setNotis(unreadNotis);
            }
          });
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    bellData();
  }, []);

  const pacthNotices = (id) => {
    axios.patch(
      `${process.env.EXPO_PUBLIC_API_URL}/notice/${usersId}/${id}/read`
    );
  };
  const getTimes = (apiTime) => {
    const now = new Date();
    const date = new Date(apiTime);
    const diffMs = now.getTime() - date.getTime();
    const minutes = Math.floor(diffMs / 1000 / 60);

    if (minutes <= 1) {
      return "방금 전"; // 1분 미만
    } else if (minutes < 60) {
      return `${minutes}분 전`; //1분 이상 60분 미만
    } else if (minutes < 60 * 24) {
      const hours = Math.floor(minutes / 60);
      return `${hours}시간 전`; //1시간 이상 24시간 미만
    } else if (minutes < 60 * 24 * 30) {
      const days = Math.floor(minutes / 60 / 24);
      return `${days}일 전`; //1일 이상 30일 이하
    } else if (minutes < 60 * 24 * 30 * 12) {
      const month = Math.floor(minutes / 60 / 24 / 30);
      return `${month}달 전`; //1달 이상 1년 이하
    } else {
      const years = Math.floor(minutes / 60 / 24 / 365);
      return `${years}년 전`; //1년 이상
    }
  };

  const handlePress = (id) => {
    setNotis((prev) =>
      prev.map((n) => (n.notice_id === id ? { ...n, read: true } : n))
    );

    const a = id.toString();
    setGetNoticeid(a);
    console.log(getNoticeid);
    pacthNotices(id);
  };

  const renderNotificationItem = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        flexDirection: "row",
        padding: 25,
        borderBottomColor: "#CCCCCC",
        borderBottomWidth: index < notis.length - 1 ? 1 : 0,
        height: 128.5,
        backgroundColor: item.read ? "#fff" : "#E3E6FF",
        position: "relative",
      }}
      onPress={() => handlePress(item.notice_id)}
    >
      <View style={{ marginRight: 12 }}>
        <Image
          source={require("../../assets/icons/bell_yellow.png")}
          style={{ width: 20, height: 20, marginBottom: 4, marginLeft: 15 }}
          resizeMode="contain"
        />
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 14,
              color: "#808080",
              marginBottom: 14,
              fontWeight: "600",
            }}
          >
            면접알림
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#808080",
              marginBottom: 4,
              marginLeft: 12,
              lineHeight: 21,
            }}
          >
            {getTimes(item.created_at)}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "#191919",
            marginBottom: 4,
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#191919",
            fontWeight: "400",
            paddingBottom: 23,
          }}
        >
          {item.content}
        </Text>
      </View>

      {item.read && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.4)",
            zIndex: 1,
          }}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 상단 헤더 */}
      <View
        style={{
          height: 56,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../../assets/icons/bell_arrow.png")}
            style={{ left: 22, width: 24, height: 48 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text
          style={{
            position: "absolute",
            left: 50,
            right: 50,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "400",
            color: "#191919",
          }}
        >
          알림
        </Text>
      </View>

      <FlatList
        data={notis}
        keyExtractor={(item) => item.notice_id.toString()}
        renderItem={renderNotificationItem}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}
