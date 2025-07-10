export const options = {
  headerShown: false,
};
import React, { useState, useRef } from "react";
import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// 이번 주(일~토) 날짜 배열 반환
function getCurrentWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

// 날짜별 일정 데이터 예시
const schedules = {
  0: "회의",
  2: "면접",
  4: "프로젝트",
  5: "프로젝트",
};

// 주간 달력 컴포넌트
function WeeklyCalendar() {
  const weekDates = getCurrentWeekDates();
  const today = new Date();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "2%",
        width: "100%",
        alignSelf: "flex-start",
      }}
    >
      {weekDates.map((date, idx) => {
        const isToday =
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate();

        const scheduleText = schedules[date.getDay()];

        return (
          <TouchableOpacity
            key={idx}
            style={{
              alignItems: "center",
              flex: 1,
              height: "100%",
              borderRadius: 8,
              backgroundColor: "#fff",
              justifyContent: "flex-start",
              position: "relative",
            }}
            activeOpacity={0.7}
          >
            {isToday ? (
              <>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#5900FF",
                    borderRadius: 15,
                    marginTop: 8,
                    position: "relative",
                  }}
                >
                  {/* 오늘이면서 일정이 있는 날에만 흰색 점 */}
                  {isToday && scheduleText && (
                    <View
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: "#fff",
                        position: "absolute",
                        top: 3,
                      }}
                    />
                  )}
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "bold",
                      color: "#fff",
                      textAlign: "center",
                      top: 3,
                    }}
                  >
                    {date.getDate()}
                  </Text>
                </View>
                {scheduleText && (
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#222",
                      marginTop: 6,
                      textAlign: "center",
                      maxWidth: 40,
                      alignSelf: "center",
                    }}
                  >
                    {scheduleText}
                  </Text>
                )}
              </>
            ) : (
              <>
                {scheduleText && (
                  <View
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: "#222",
                      position: "absolute",
                      top: 12,
                      zIndex: 1,
                    }}
                  />
                )}
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    color: "#222",
                    marginTop: 16,
                    zIndex: 0,
                  }}
                >
                  {date.getDate()}
                </Text>
                {scheduleText && (
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#222",
                      marginTop: 6,
                      textAlign: "center",
                      maxWidth: 40,
                      alignSelf: "center",
                    }}
                  >
                    {scheduleText}
                  </Text>
                )}
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// 둥근 막대바 컴포넌트
function RoundedBar({
  value = 0,
  height = 7,
  backgroundColor = "#E4E4E4",
  barColor = "#5900FF",
}) {
  const percent = Math.max(0, Math.min(100, value));
  return (
    <View
      style={{
        width: "100%",
        height,
        backgroundColor,
        borderRadius: height / 2,
        overflow: "hidden",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: `${percent}%`,
          height: "100%",
          backgroundColor: barColor,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}

export default function Home() {
  const [textBoxHeight, setTextBoxHeight] = useState(227);
  const [shouldScroll, setShouldScroll] = useState(false);
  const scrollRef = useRef(null);
  const router = useRouter();
  const evaluationData = [
    { label: "업무이해도", percent: 77 },
    { label: "기술역량", percent: 65 },
    { label: "의사소통", percent: 88 },
  ];

  // 버튼 클릭시 나오는 글자
  const expandedNotice = [
    {
      a: "위기대처능력 73% 자세 64% 자신감 55%",
      b: "닉네임님은 지난 aa 회사 면접에서 업무이해도, 위기대처능력, 자세에서는 강한 편이고, 자신감, 표정, 말투에서는 아쉬운 편이에요.",
      c: "다음 면접에서는 자신감, 표정, 말투에 더 노력해 보는 게 좋을 것 같아요",
    },
  ];

  const toggleTextHeight = () => {
    setTextBoxHeight((prev) => (prev === 227 ? 412 : 227));
    setShouldScroll(true);
  };

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
          onPress={() => router.push("../(auth)/bell")}
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
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{
          paddingTop: "6%",
          backgroundColor: "#fff",
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: "80%", alignSelf: "center" }}>
          <Text style={{ fontSize: 16, fontWeight: "400", marginLeft: "3%" }}>
            님,
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "400",
              marginLeft: "3%",
              marginTop: "3%",
            }}
          >
            이번 주에 면접이 개 예정되어 있어요.
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#CCCCCC",
              borderRadius: 10,
              marginTop: "5%",
              height: 97,
            }}
          >
            <WeeklyCalendar />
          </View>

          <View
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 12,
              flexDirection: "column",
              alignItems: "stretch",
              paddingHorizontal: "4%",
              paddingVertical: "3%",
              marginTop: "10%",
              marginBottom: "10%",
              minHeight: textBoxHeight,
              overflow: "hidden", // 박스 밖으로 내용이 넘치지 않게
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 32,
                marginTop: "3%",
              }}
            >
              {/* 왼쪽 묶음 (텍스트 + 날짜) */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                  marginLeft: "4%",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#191919",
                    lineHeight: 20,
                    fontWeight: "600",
                    textAlign: "left",
                  }}
                >
                  aa 회사 면접
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    color: "#191919",
                    marginLeft: "3%",
                    lineHeight: 34,
                  }}
                >
                  2025.07.07
                </Text>
              </View>
              {/* 오른쪽 텍스트 */}
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  color: "#808080",
                  lineHeight: 34,
                  textAlign: "right",
                  marginRight: "2%",
                  minWidth: 50,
                }}
              >
                1일전
              </Text>
            </View>

            {evaluationData.map((item, i) => (
              <View
                key={i}
                style={{
                  width: "95%",
                  marginTop: "6%",
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                <Text style={{ marginRight: "3%", minWidth: 65, width: "10%" }}>
                  {item.label}
                </Text>
                <View style={{ flex: 1, marginHorizontal: "2%" }}>
                  <RoundedBar value={item.percent} />
                </View>
                <Text
                  style={{
                    marginRight: "-1%",
                    minWidth: 50,
                    textAlign: "right",
                  }}
                >
                  {item.percent}%
                </Text>
              </View>
            ))}

            {/* 안내 메시지: 박스가 커졌을 때만, 내부에서 스크롤 가능 */}
            {textBoxHeight === 412 && (
              <View
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflow: "hidden",
                  justifyContent: "flex-start",
                }}
              >
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{ paddingBottom: 8 }}
                  showsVerticalScrollIndicator={false}
                >
                  {expandedNotice.map((item, i) => (
                    <View key={i} style={{ padding: 0 }}>
                      <View
                        style={{
                          marginTop: 47,
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        {item.a.split(" ").map((word, idx) => (
                          <Text
                            key={idx}
                            style={{
                              color: /\d+%/.test(word) ? "#5900FF" : "#808080",
                              fontWeight: /\d+%/.test(word) ? "600" : "100",
                              fontSize: 13,
                              lineHeight: 20,
                              marginRight: 6,
                            }}
                          >
                            {word + " "}
                          </Text>
                        ))}
                      </View>
                      <Text
                        style={{
                          margin: 10,
                          textAlign: "left",
                          color: "#191919",
                          fontWeight: "300",
                          fontSize: 14,
                          lineHeight: 20,
                          flexWrap: "wrap",
                          fontStyle: "normal",
                          letterSpacing: -0.84,
                        }}
                      >
                        {item.b}
                      </Text>
                      <Text
                        style={{
                          margin: 10,
                          textAlign: "left",
                          color: "#191919",
                          fontWeight: "300",
                          fontSize: 14,
                          lineHeight: 20,
                          flexWrap: "wrap",
                          fontStyle: "normal",
                          letterSpacing: -0.84,
                        }}
                      >
                        {item.c}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              style={{
                marginTop: textBoxHeight === 412 ? 8 : "auto",
                alignSelf: "center",
              }}
              onPress={toggleTextHeight}
              activeOpacity={0.7}
            >
              <Image
                source={require("../../assets/icons/arow.png")}
                style={{ width: 40, height: 17, alignSelf: "center" }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: "100%",
              minHeight: "11%",
              borderWidth: 1,
              borderColor: "#CCCCCC",
              borderRadius: 10,
              marginTop: "7%",
              marginBottom: "5%",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: 26,
            }}
          >
            <Text
              style={{
                fontWeight: "600",
                fontSize: 16,
                color: "#191919",
                marginBottom: "4%",
              }}
            >
              오늘의 질문
            </Text>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 14,
                color: "#191919",
              }}
            >
              가장 최선을 다했던 경험은 무엇인가요?
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
