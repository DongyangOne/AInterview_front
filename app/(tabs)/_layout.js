import React from "react";
import { Tabs } from "expo-router";
import { View, Image, Text, TouchableOpacity } from "react-native";

export const unstable_settings = {
  initialRouteName: "home",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#5900FF",
        tabBarStyle: {
          height: "6.9%", // 56/812 비율
          backgroundColor: "#ffffff",
          borderTopWidth: 0, // 상단 경계선 제거
          elevation: 0,
          alignItems: "center",
          width: "100%",
        },
        tabBarButton: (props) => (
          <TouchableOpacity {...props} activeOpacity={1} />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false, // 상단 타이틀 숨기기
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/icons/home.png")}
                style={{
                  marginTop: 20,
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
                  marginTop: 20,
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
          headerShown: false, // 상단 타이틀 숨기기
          title: "",
          tabBarStyle: { display: "none" }, // 하단바 숨기기
          tabBarIcon: () => null, // 기본 아이콘 제거
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={1}
            >
              <View
                style={{
                  position: "absolute",
                  top: -25,
                  width: 64,
                  height: 64,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../assets/icons/interview.png")}
                  style={{ width: 64, height: 64 }}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          ),
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
                  marginTop: 20,
                  width: 18,
                  height: 20,
                  tintColor: color,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 10,
                  width: 30,
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
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/icons/Person.png")}
                style={{
                  marginTop: 10,
                  width: 24,
                  height: 24,
                  marginRight: "30.77%",
                  tintColor: color,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 10,
                  marginRight: "7.77%",
                  width: 50,
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
  );
}
