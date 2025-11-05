import { use } from "react";
import { ConfigContext } from "../context/config";

export interface CentralBoardProps {
  width: number;
  height: number;
  x?: number;
  y?: number;
  appName?: string;
  version?: string;
  name?: string;
  gender?: string;
  fiveElementName?: string;
  lunisolarDate?: string;
  solarDate?: string;
  solarDateByTrue?: string;
  sexagenaryCycleDate?: string;
}

export default function CentralPalace({
  appName = "紫微斗数",
  version = "v1.0.0",
  name,
  gender,
  fiveElementName,
  lunisolarDate,
  solarDate,
  solarDateByTrue,
  sexagenaryCycleDate,
  width,
  height,
  x,
  y,
}: CentralBoardProps) {
  const { centralPalacePadding, fontSize, centralPalaceFontSize, centralPalaceVersionFontSize } =
    use(ConfigContext);
  return (
    <svg x={x} y={y}>
      <title>中宫</title>
      <rect x="0" y="0" width={width} height={height} fill="transparent" />
      <g>
        <text
          x={width / 2}
          y={fontSize + centralPalacePadding}
          textAnchor="middle"
          fontSize={fontSize}
        >
          {appName}
        </text>
        <text
          x={width / 2 + (fontSize * appName.length) / 2}
          y={centralPalaceVersionFontSize + centralPalacePadding}
          fontSize={centralPalaceVersionFontSize}
        >
          {version}
        </text>
      </g>

      {/* <g>
        <text
          x={centralPalacePadding}
          y={60}
          textAnchor="start"
          fontSize={centralPalaceFontSize}
        >
          姓名：{name}
        </text>
        <text
          x={width - centralPalacePadding}
          y={60}
          textAnchor="end"
          fontSize={centralPalaceFontSize}
        >
          {gender} {fiveElementName}
        </text>
      </g>
      <g>
        <text
          x={centralPalacePadding}
          y={60 + centralPalaceFontSize + 10}
          fontSize={centralPalaceFontSize}
        >
          农历时间
        </text>
        <text
          x={centralPalacePadding + centralPalaceFontSize * 4 + 10}
          y={60 + centralPalaceFontSize + 10}
          fontSize={centralPalaceFontSize}
        >
          {lunisolarDate}
        </text>
      </g>
      <g>
        <text
          x={centralPalacePadding}
          y={60 + (centralPalaceFontSize + 10) * 2}
          fontSize={centralPalaceFontSize}
        >
          阳历时间
        </text>
      </g>
      <text
        x={centralPalacePadding + centralPalaceFontSize * 4 + 10}
        y={60 + (centralPalaceFontSize + 10) * 2}
        fontSize={centralPalaceFontSize}
      >
        {solarDate}
      </text>
      <g>
        <text
          x={centralPalacePadding}
          y={60 + (centralPalaceFontSize + 10) * 3}
          fontSize={centralPalaceFontSize}
        >
          真太阳时
        </text>
        <text
          x={centralPalacePadding + centralPalaceFontSize * 4 + 10}
          y={60 + (centralPalaceFontSize + 10) * 3}
          fontSize={centralPalaceFontSize}
        >
          {solarDateByTrue || "-"}
        </text>
      </g>
      <g>
        <text
          x={centralPalacePadding}
          y={60 + (centralPalaceFontSize + 10) * 4}
          fontSize={centralPalaceFontSize}
        >
          节气四柱
        </text>
        <text
          x={centralPalacePadding + centralPalaceFontSize * 4 + 10}
          y={60 + (centralPalaceFontSize + 10) * 4}
          fontSize={centralPalaceFontSize}
        >
          {sexagenaryCycleDate}
        </text>
      </g> */}
    </svg>
  );
}
