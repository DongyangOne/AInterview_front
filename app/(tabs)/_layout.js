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
      headerShown:false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
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
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TouchableOpacity>
              <View
                style={{
                  width: 64,
                  height: 86,
                }}
              >
                <Image
                  source={require("../../assets/icons/interview.png")}
                  style={{
                    position: "absolute",
                    bottom: 16,
                    width: 64,
                    height: 64,
                  }}
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
  );
}
