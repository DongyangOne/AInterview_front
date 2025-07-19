import React, { useRef, useState } from "react";
import { Tabs } from "expo-router";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

// FloatingActionButton 컴포넌트 (오버레이/선택지 메뉴는 외부 상태로 컨트롤)
function FloatingActionButton({ open, setOpen }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [open]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <View style={styles.fabContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen(!open)}
        style={styles.fab}
      >
        <View
          style={{
            width: 64,
            height: 86,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.Image
            source={require("../../assets/icons/interview.png")}
            style={{
              width: 64,
              height: 64,
              transform: [{ rotate: rotation }],
            }}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {/* (1) 기본 Tabs 화면 */}
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#ffffff",
            height: 64,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            borderTopWidth: 0,
            elevation: 0,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../../assets/icons/home.png")}
                  style={{
                    marginTop: 10,
                    width: 22,
                    height: 18.9,
                    marginLeft: "10.19%",
                    tintColor: color,
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    marginLeft: "10.19%",
                    fontSize: 10,
                    color: focused ? color : "#999",
                  }}
                >
                  홈
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="feedback"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../../assets/icons/feedback.png")}
                  style={{
                    marginTop: 10,
                    width: 18,
                    height: 20,
                    marginLeft: "10%",
                    tintColor: color,
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    marginLeft: "10%",
                    fontSize: 10,
                    width: 30,
                    color: focused ? color : "#999",
                  }}
                >
                  피드백
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="interview"
          options={{
            headerShown: false,
            title: "",
            tabBarIcon: () => null,
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../../assets/icons/calendar.png")}
                  style={{
                    marginTop: 10,
                    width: 18,
                    height: 20,
                    tintColor: color,
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: focused ? color : "#999",
                  }}
                >
                  캘린더
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="myPage"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../../assets/icons/Person.png")}
                  style={{
                    marginTop: 10,
                    marginLeft: "0.7%",
                    width: 24,
                    height: 24,
                    tintColor: color,
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontSize: 10,
                    marginLeft: "0.7%",
                    width: 44,
                    color: focused ? color : "#999",
                  }}
                >
                  마이페이지
                </Text>
              </View>
            ),
          }}
        />
      </Tabs>

      {/* (2) 오버레이 & 메뉴 */}
      {open && (
        <>
          {/* 오버레이 - Blur + 반투명 색을 섞어줌 */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setOpen(false)}
          >
            <BlurView
              intensity={40}
              tint="light"
              style={StyleSheet.absoluteFill}
            >
              <View style={styles.overlayGray} />
            </BlurView>
          </TouchableOpacity>
          {/* 선택지 메뉴 - 화면 수직 가운데 */}
          <View style={styles.centerMenu}>
            <TouchableOpacity style={styles.optionBtn}>
              <Text style={styles.optionText}>서버 관리자</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBtn}>
              <Text style={styles.optionText}>백엔드</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBtn}>
              <Text style={styles.optionText}>프론트</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* (3) 플로팅 액션 버튼 (+버튼) 항상 하단에 위치 */}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <FloatingActionButton open={open} setOpen={setOpen} />
      </View>
    </View>
  );
}

// 스타일
const styles = StyleSheet.create({
  fabContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 18,
    width: width,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 7,
  },
  overlayGray: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(25,25,25,0.4)",
  },
  centerMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    top: height * 0.6,
    alignItems: "center",
    zIndex: 12,
  },

  optionBtn: {
    backgroundColor: "#5900FF",
    width: 348,
    height: 67,
    borderRadius: 10,
    margin: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },

  optionText: {
    color: "#fff",
    fontFamily: "Pretendard-Bold", // expo-font 등으로 Pretendard 적용
    fontSize: 20,
    fontWeight: "bold",
  },
});
