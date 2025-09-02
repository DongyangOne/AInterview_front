import React from "react";
import { View } from "react-native";
import Svg, { Polygon, Line, Text as SvgText, G } from "react-native-svg";

const RadarChart = ({ data }) => {

  const size = 300;
  const padX = 28;
  const padY = 28;
  const center = size / 2;
  const count = 6;
  const radius = size / 2 - 24;

  const ROT = -Math.PI / 6;
  const angles = Array.from({ length: count }, (_, i) => (Math.PI * 2 * i) / count);

  const getPoint = (angle: number, value: number) => {
    const a = angle - Math.PI / 2 + ROT;
    const x = center + radius * value * Math.cos(a);
    const y = center + radius * value * Math.sin(a);
    return `${x},${y}`;
  };

  const values = [
    data?.pose,
    data?.confidence,
    data?.risk_response,
    data?.understanding,
    data?.tone,
    data?.facial,
  ];
  const normalized = values.map((v) => Math.min((Number(v) || 0) / 100, 1));
  const points = normalized.map((v, i) => getPoint(angles[i], v)).join(" ");

  const labels = ["자세", "자신감", "위기 대처능력", "업무이해도", "말투", "표정"];

  return (
    <View style={{ alignItems: "center", marginBottom: 20 }}>
      <Svg width={size + padX * 2} height={size + padY * 2}>
        <G transform={`translate(${padX}, ${padY})`}>

        {Array.from({ length: 6 }, (_, i) => (i + 1) / 6).map((level, i) => (
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
