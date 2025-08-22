import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MainCalendar from "../../components/main/MainCalendar";
import MainFeedback from "../../components/main/MainFeedback";
import MainQuestion from "../../components/main/MainQuestion";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Home() {
  const scrollRef = useRef(null);
  const router = useRouter();
  const [weekSchedules, setWeekSchedules] = useState("0");
  const [nickname, setNickname] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setNickname(await AsyncStorage.getItem("NickName"));
        const usersId = await AsyncStorage.getItem("userId");
        await axios
          .get(`${process.env.EXPO_PUBLIC_API_URL}/mainpage/calendar`, {
            params: { userId: usersId },
          })
          .then((res) => {
            console.log(res.data);
            const count = res.data.data.map((item) => ({
              id: item.calendar_id.toString(),
            }));
            setWeekSchedules(count.length.toString());
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          width: "100%",
          height: 56,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingHorizontal: "4%",
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("../screens/bell")}
          style={{ padding: 6 }}
        >
          <Image
            source={require("../../assets/icons/bell.png")}
            style={{ width: 24, height: 24, right: 32 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          <Text style={styles.greeting}>{nickname}님,</Text>
          <Text style={styles.interviewInfo}>
            이번 주에 면접
            <Text style={styles.accent}>
              {" "}
              {weekSchedules ? weekSchedules : "로딩 중"}개
            </Text>
            가 예정되어 있어요.
          </Text>
          <View style={styles.calendarBox}>
            <MainCalendar />
          </View>
          <MainFeedback />
          <MainQuestion />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingTop: "6%",
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  container: {
    width: "80%",
    alignSelf: "center",
  },
  greeting: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: "3%",
  },
  interviewInfo: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: "3%",
    marginTop: "3%",
  },
  accent: {
    color: "#5900FF",
  },
  calendarBox: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    marginTop: "5%",
    height: 97,
  },
});
