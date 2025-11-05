import type { Palace, StarProps as ZiWeiStarProps } from "@ziweijs/core";
import { use } from "react";
import { ConfigContext } from "../context/config";
import { RuntimeContainer } from "../hooks/runtime";
import ArrowLine from "./ArrowLine";

const [bottom, left, top, right] = [
  [0, 11, 10, 9],
  [1, 2],
  [3, 4, 5, 6],
  [7, 8],
];

export interface StarProps extends ZiWeiStarProps {
  index: number;
  x: number;
  y: number;
  fill?: string;
  palace: Palace;
  starKey: ZiWeiStarProps["key"];
}

export default function Star({ index, x, y, name, fill, palace, starKey, YT, ST }: StarProps) {
  const {
    palaceSide,
    palacePadding,
    palaceStrokeWidth,
    selfTransformationFontSize,
    fontSize,
    boardStrokeWidth,
    boardPadding,
    selfTransformationStroke,
    selfTransformationMarginTop,
    fontLineHeight,
    arrowSize,
    flyingTransformationFill,
    flyingTransformationColor,
  } = use(ConfigContext);
  const { flyingTransformations } = RuntimeContainer.useContainer();

  const hasFlying = flyingTransformations.includes(starKey);

  const [width, height, padding] = [fontSize * fontLineHeight, fontSize * 2, palaceStrokeWidth * 2];

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height + padding}
        fill={
          hasFlying
            ? flyingTransformationFill[flyingTransformations.indexOf(starKey)]
            : "transparent"
        }
      />
      <text
        x={x + (fontSize * fontLineHeight) / 2}
        y={y + padding / 2}
        writingMode="vertical-rl"
        fontSize={fontSize}
        letterSpacing={0}
        wordSpacing={0}
        fill={hasFlying ? flyingTransformationColor : fill}
      >
        {name}
      </text>
      {/*生年四化*/}
      {YT?.key && (
        <text
          x={x + (fontSize * fontLineHeight) / 2}
          y={y + fontSize * 3 + padding / 2}
          fontSize={fontSize}
          letterSpacing={0}
          wordSpacing={0}
          textAnchor="middle"
          fill={selfTransformationStroke}
          fontWeight={900}
        >
          {YT?.key}
        </text>
      )}
      {/*离心自化*/}
      {ST?.CF && left.includes(palace.index) && (
        <g>
          <ArrowLine
            points={[
              [
                x + (fontSize * fontLineHeight) / 2,
                y + fontSize * 2 + selfTransformationMarginTop + padding,
              ],
              [x + (fontSize * fontLineHeight) / 2, y + fontSize * (2 + 1.5 + 0.7 * index)],
              [-boardStrokeWidth, y + fontSize * (2 + 1.5 + 0.7 * index)],
            ]}
            arrowSize={arrowSize}
            stroke={selfTransformationStroke}
            strokeWidth={palaceStrokeWidth}
          />
          <text
            x={0 - boardStrokeWidth - boardPadding - (0.7 * selfTransformationFontSize) / 2}
            y={y + fontSize * (2 + 1.5 + 0.7 * index) + (0.7 * selfTransformationFontSize) / 2}
            fontSize={selfTransformationFontSize}
            fill={selfTransformationStroke}
            textAnchor="middle"
          >
            {ST?.CF.key}
          </text>
        </g>
      )}
      {ST?.CF && right.includes(palace.index) && (
        <g>
          <ArrowLine
            points={[
              [
                x + (fontSize * fontLineHeight) / 2,
                y + fontSize * 2 + selfTransformationMarginTop + padding,
              ],
              [x + (fontSize * fontLineHeight) / 2, y + fontSize * (2 + 1.5 + 0.7 * index)],
              [palaceSide + boardStrokeWidth, y + fontSize * (2 + 1.5 + 0.7 * index)],
            ]}
            arrowSize={arrowSize}
            stroke={selfTransformationStroke}
            strokeWidth={palaceStrokeWidth}
          />
          <text
            x={
              palaceSide + boardStrokeWidth + boardPadding + (0.7 * selfTransformationFontSize) / 2
            }
            y={y + fontSize * (2 + 1.5 + 0.7 * index) + (0.7 * selfTransformationFontSize) / 2}
            fontSize={selfTransformationFontSize}
            textAnchor="middle"
            fill={selfTransformationStroke}
          >
            {ST?.CF.key}
          </text>
        </g>
      )}
      {ST?.CF && top.includes(palace.index) && (
        <g>
          <ArrowLine
            points={[
              [x + (fontSize * fontLineHeight) / 2, y - selfTransformationMarginTop],
              [x + (fontSize * fontLineHeight) / 2, y - palacePadding - boardStrokeWidth],
            ]}
            arrowSize={arrowSize}
            stroke={selfTransformationStroke}
            strokeWidth={palaceStrokeWidth}
          />
          <text
            x={x + (fontSize * fontLineHeight) / 2}
            y={y - palacePadding - boardStrokeWidth - boardPadding}
            fontSize={selfTransformationFontSize}
            textAnchor="middle"
            fill={selfTransformationStroke}
          >
            {ST?.CF.key}
          </text>
        </g>
      )}
      {ST?.CF && bottom.includes(palace.index) && (
        <g>
          <ArrowLine
            points={[
              [
                x + (fontSize * fontLineHeight) / 2,
                y + fontSize * 2 + selfTransformationMarginTop + padding,
              ],
              [x + (fontSize * fontLineHeight) / 2, palaceSide + boardStrokeWidth],
            ]}
            arrowSize={arrowSize}
            stroke={selfTransformationStroke}
            strokeWidth={palaceStrokeWidth}
          />
          <text
            x={x + (fontSize * fontLineHeight) / 2}
            y={palaceSide + boardPadding + boardStrokeWidth + 0.7285 * selfTransformationFontSize}
            fontSize={selfTransformationFontSize}
            textAnchor="middle"
            fill={selfTransformationStroke}
          >
            {ST?.CF.key}
          </text>
        </g>
      )}
    </g>
  );
}
