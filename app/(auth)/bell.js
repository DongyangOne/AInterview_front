import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// 알림 데이터 예시
const notifications = [
  {
    id: 1,
    title: "면접 당일이에요!",
    desc: "삼성 면접이 오늘입니다.",
    time: "1분 전",
    read: false,
  },
  {
    id: 2,
    title: "면접 일정 안내",
    desc: "내일 10시 ONE 면접이 예정되어 있습니다.",
    time: "1시간 전",
    read: false,
  },
  {
    id: 3,
    title: "면접 당일이에요!",
    desc: "삼성 면접이 오늘입니다.",
    time: "1분 전",
    read: false,
  },
  {
    id: 4,
    title: "면접 일정 안내",
    desc: "내일 10시 ONE 면접이 예정되어 있습니다.",
    time: "1시간 전",
    read: false,
  },
  {
    id: 5,
    title: "면접 당일이에요!",
    desc: "삼성 면접이 오늘입니다.",
    time: "1분 전",
    read: false,
  },
  {
    id: 6,
    title: "면접 일정 안내",
    desc: "내일 10시 ONE 면접이 예정되어 있습니다.",
    time: "1시간 전",
    read: false,
  },
  {
    id: 7,
    title: "면접 일정 안내",
    desc: "내일 10시 ONE 면접이 예정되어 있습니다.",
    time: "1시간 전",
    read: false,
  },
];

export default function Bell() {
  const [notis, setNotis] = useState(notifications);
  const router = useRouter();

  const handlePress = (id) => {
    setNotis((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        flexDirection: "row",
        padding: 25,
        borderBottomColor: "#808080",
        borderBottomWidth: index < notis.length - 1 ? 1 : 0,
        height: 128.5,
        backgroundColor: item.read ? "#fff" : "#E3E6FF",
        position: "relative",
      }}
      onPress={() => handlePress(item.id)}
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
              paddingtop: 14,
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
            {item.time}
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
          {item.desc}
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
          justifyContent: "space-between",
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          backgroundColor: "#fff",
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
            fontSize: 20,
            fontWeight: "400",
            color: "#222",
          }}
        >
          알림
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {/* 리스트 */}
      <FlatList
        data={notis}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}
