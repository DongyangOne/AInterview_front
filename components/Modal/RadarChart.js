import React from "react";
import { View } from "react-native";
import Svg, { Polygon, Line, Text as SvgText, G } from "react-native-svg";

const RadarChart = ({ data }) => {
  // ----- 크기/레이아웃 -----
  const size = 300;          // 도형 기준 크기
  const padX = 28;           // 좌우 여유(라벨 잘림 방지)
  const padY = 28;           // 상하 여유
  const center = size / 2;
  const count = 6;
  const radius = size / 2 - 24; // 라벨과 겹치지 않게 살짝 안쪽

  // ----- 각도 & 회전 -----
  // 기본식(angle - Math.PI/2)에 회전값을 더해 전체를 회전.
  // flat-top + '자세'가 현재 '표정' 위치에 오도록 60° 반시계 회전
  const ROT = -Math.PI / 6; // -30도 (필요시 -Math.PI/6 ± Math.PI/3 로 미세 튜닝)
  const angles = Array.from({ length: count }, (_, i) => (Math.PI * 2 * i) / count);

  const getPoint = (angle: number, value: number) => {
    const a = angle - Math.PI / 2 + ROT;
    const x = center + radius * value * Math.cos(a);
    const y = center + radius * value * Math.sin(a);
    return `${x},${y}`;
  };

  // ----- 데이터(라벨과 1:1 매칭) -----
  // 원하는 시계방향: 자세 → 자신감 → 위기대처능력 → 업무이해도 → 말투 → 표정
  const values = [
    data?.pose,           // 자세
    data?.confidence,     // 자신감
    data?.risk_response,  // 위기 대처능력
    data?.understanding,  // 업무이해도
    data?.tone,           // 말투
    data?.facial,         // 표정
  ];
  const normalized = values.map((v) => Math.min((Number(v) || 0) / 100, 1));
  const points = normalized.map((v, i) => getPoint(angles[i], v)).join(" ");

  const labels = ["자세", "자신감", "위기 대처능력", "업무이해도", "말투", "표정"];

  return (
    <View style={{ alignItems: "center", marginBottom: 20 }}>
      {/* 여백 포함한 전체 캔버스 크기 */}
      <Svg width={size + padX * 2} height={size + padY * 2}>
        {/* 전체를 padX, padY만큼 안쪽으로 이동 */}
        <G transform={`translate(${padX}, ${padY})`}>
          {/* 배경 그리드(회색 라인) */}
          {[0.25, 0.5, 0.75, 1].map((level, i) => (
            <Polygon
              key={`grid-${i}`}
              points={angles.map((angle) => getPoint(angle, level)).join(" ")}
              fill="none"
              stroke="#000"
              strokeWidth={0.7}
              opacity={0.6}
            />
          ))}

          {/* 축 라인 */}
          {angles.map((angle, i) => {
            const a = angle - Math.PI / 2 + ROT;
            return (
              <Line
                key={`axis-${i}`}
                x1={center}
                y1={center}
                x2={center + radius * Math.cos(a)}
                y2={center + radius * Math.sin(a)}
                stroke="#B5B5B5"
                strokeWidth={0.8}
              />
            );
          })}

          {/* 데이터 영역(보라) */}
          <Polygon
            points={points}
            fill="rgba(89,0,255,0.2)"
            stroke="#5900FF"
            strokeWidth={2}
          />

          {/* 라벨 */}
          {angles.map((angle, i) => {
            const a = angle - Math.PI / 2 + ROT;
            const labelOffset = 22; // 라벨과 도형 사이 거리
            const x = center + (radius + labelOffset) * Math.cos(a);
            const y = center + (radius + labelOffset) * Math.sin(a);

            // "위기 대처능력"은 두 줄로
            if (i === 2) {
              return (
                <React.Fragment key={`label-${i}-frag`}>
                  <SvgText
                    key={`label-${i}-1`}
                    x={x}
                    y={y - 8}
                    fontSize="13"
                    fill="#000"
                    textAnchor="middle"
                  >
                    위기
                  </SvgText>
                  <SvgText
                    key={`label-${i}-2`}
                    x={x}
                    y={y + 8}
                    fontSize="13"
                    fill="#000"
                    textAnchor="middle"
                  >
                    대처능력
                  </SvgText>
                </React.Fragment>
              );
            }

            return (
              <SvgText
                key={`label-${i}`}
                x={x}
                y={y}
                fontSize="13"
                fill="#000"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {labels[i]}
              </SvgText>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

export default RadarChart;
