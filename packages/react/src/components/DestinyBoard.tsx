import {
  type HoroscopePalace,
  type Palace as PalaceModel,
  type StarTransformation,
  ziwei,
} from "@ziweijs/core";
import { Activity, use, useMemo, useRef, useState } from "react";
import { ConfigContext } from "../context/config";
import { RuntimeContainer } from "../hooks/runtime";
import ArrowLine from "./ArrowLine";
import CentralPalace from "./CentralPalace";
import ContextMenu from "./ContextMenu";
import LaiYin from "./LaiYin";
import Palace from "./Palace";
import Stars from "./Stars";

export interface DestinyBoardProps {
  width?: number;
  height?: number;
}

const person = ziwei.byLunisolar({
  name: "xxx",
  // date: "1995-9-7-11",
  date: "1984-7-15-1",
  gender: "female",
  language: "zh-Hant",
});

export default function DestinyBoard({ width = 600, height = 600 }: DestinyBoardProps) {
  const {
    boardSide,
    boardX,
    boardY,
    boardFill,
    boardStroke,
    boardStrokeWidth,
    palaceSide,
    boardPadding,
    palaceFlyFill,
    palaceHoroscopeFill,
    palacePadding,
    fontLineHeight,
    fontSize,
    horizontalRectWidth,
    horizontalRectHeight,
    verticalRectWidth,
    verticalRectHeight,
    horoscopeRangesFontSize,
    palaceStrokeWidth,
    selfTransformationFontSize,
    selfTransformationStroke,
    laiYinFlagX,
    laiYinFlagY,
    arrowSize,
    yearlyFontSize,
    centralPalaceSide,
    centralPalaceX,
    centralPalaceY,
  } = use(ConfigContext);
  const [horoscopeIndex, setHoroscopeIndex] = useState<number>(person.horoscope.index);
  const [horoscope, setHoroscope] = useState<HoroscopePalace[]>(person.horoscope.palaces);

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const ref = useRef(null);

  const selectedRef = useRef<number>(person.horoscope.index);

  const coordinates = [
    {
      x: boardX + boardPadding,
      y: boardY + boardPadding + palaceSide * 3,
    },
    {
      x: boardX + boardPadding,
      y: boardY + boardPadding + palaceSide * 2,
    },
    {
      x: boardX + boardPadding,
      y: boardY + boardPadding + palaceSide * 1,
    },
    {
      x: boardX + boardPadding + palaceSide * 0,
      y: boardY + boardPadding + palaceSide * 0,
    },
    {
      x: boardX + boardPadding + palaceSide * 1,
      y: boardY + boardPadding + palaceSide * 0,
    },
    {
      x: boardX + boardPadding + palaceSide * 2,
      y: boardY + boardPadding + palaceSide * 0,
    },
    {
      x: boardX + boardPadding + palaceSide * 3,
      y: boardY + boardPadding + palaceSide * 0,
    },
    {
      x: boardX + boardPadding + palaceSide * 3,
      y: boardY + boardPadding + palaceSide * 1,
    },
    {
      x: boardX + boardPadding + palaceSide * 3,
      y: boardY + boardPadding + palaceSide * 2,
    },
    {
      x: boardX + boardPadding + palaceSide * 3,
      y: boardY + boardPadding + palaceSide * 3,
    },
    {
      x: boardX + boardPadding + palaceSide * 2,
      y: boardY + boardPadding + palaceSide * 3,
    },
    {
      x: boardX + boardPadding + palaceSide * 1,
      y: boardY + boardPadding + palaceSide * 3,
    },
  ];

  const { flyingPalaceKey, setFlyingPalaceKey, setFlyingTransformations } =
    RuntimeContainer.useContainer();

  const stars = useMemo(() => {
    return person.palaces.map((item) => item.majorStars.concat(item.minorStars));
  }, []);

  const starsTransformation = useMemo(() => {
    return stars.map((star) => {
      return star.reduce<StarTransformation[]>((result, star) => {
        if (star.ST?.CP) {
          result.push(star.ST?.CP);
        }
        return result;
      }, []);
    });
  }, [stars]);

  const _CP: Array<{
    points: [number, number][];
    text: {
      x: number;
      y: number;
    };
  }> = [
    // 0
    {
      points: [
        [palaceSide * 3, -palaceSide * 2],
        [palaceSide + palaceStrokeWidth * 2, -palaceStrokeWidth * 2],
      ],
      text: {
        x: palaceSide + palaceStrokeWidth * 2 + fontSize * 1.5,
        y: -palaceStrokeWidth * 2 - fontSize / 3,
      },
    },
    // 1
    {
      points: [
        [palaceSide * 3 - palaceStrokeWidth, -palaceSide * 0.5 + palaceStrokeWidth],
        [palaceSide + palaceStrokeWidth * 2, palaceSide * 0.5 - palaceStrokeWidth * 1.5],
      ],
      text: {
        x: palaceSide + palaceStrokeWidth * 3 + fontSize,
        y: palaceSide * 0.5 - palaceStrokeWidth * 2 - fontSize,
      },
    },
    // 2
    {
      points: [
        [palaceSide * 3, palaceSide * 1.5],
        [palaceSide + palaceStrokeWidth * 2, palaceSide * 0.5 - palaceStrokeWidth],
      ],
      text: {
        x: palaceSide + palaceStrokeWidth * 2 + fontSize * 1.5,
        y: palaceSide * 0.5 - palaceStrokeWidth + fontSize / 3,
      },
    },

    // 3
    {
      points: [
        [palaceSide * 3, palaceSide * 3],
        [palaceSide + palaceStrokeWidth * 2, palaceSide + palaceStrokeWidth * 2],
      ],
      text: {
        x: palaceSide + palaceStrokeWidth * 2 + fontSize * 1.5,
        y: palaceSide + palaceStrokeWidth * 2 + fontSize,
      },
    },

    // 4
    {
      points: [
        [palaceSide * 1.5, palaceSide * 3],
        [palaceSide * 0.5 + palaceStrokeWidth * 2, palaceSide + palaceStrokeWidth * 2],
      ],
      text: {
        x: palaceSide * 0.5 + palaceStrokeWidth * 2 + fontSize * 1.5,
        y: palaceSide + palaceStrokeWidth * 2 + fontSize,
      },
    },
    // 5
    {
      points: [
        [-palaceSide * 0.5 - palaceStrokeWidth, palaceSide * 3],
        [palaceSide * 0.5 - palaceStrokeWidth * 1.5, palaceSide + palaceStrokeWidth * 2],
      ],
      text: {
        x: palaceSide * 0.5 + palaceStrokeWidth - fontSize * 1.5,
        y: palaceSide + palaceStrokeWidth * 2 + fontSize,
      },
    },
    // 6
    {
      points: [
        [-palaceSide * 2, palaceSide * 3],
        [-palaceStrokeWidth * 2, palaceSide + palaceStrokeWidth * 2],
      ],
      text: {
        x: -palaceStrokeWidth * 2 - fontSize * 1.5,
        y: palaceSide + palaceStrokeWidth * 2 + fontSize,
      },
    },

    // 7
    {
      points: [
        [-palaceSide * 2 + palaceStrokeWidth, palaceSide * 1.5 - palaceStrokeWidth],
        [-palaceStrokeWidth * 2, palaceSide * 0.5 + palaceStrokeWidth * 1.5],
      ],
      text: {
        x: -palaceStrokeWidth * 2 - fontSize * 1.5,
        y: palaceSide * 0.5 + palaceStrokeWidth * 2,
      },
    },

    // 8
    {
      points: [
        [-palaceSide * 2 + palaceStrokeWidth, -palaceSide * 0.5 - palaceStrokeWidth * 1.5],
        [-palaceStrokeWidth * 2, palaceSide * 0.5 - palaceStrokeWidth],
      ],
      text: {
        x: -palaceStrokeWidth * 3 - fontSize * 0.7,
        y: palaceSide * 0.5 - palaceStrokeWidth - fontSize,
      },
    },
    // 9
    {
      points: [
        [-palaceSide * 2 + palaceStrokeWidth, -palaceSide * 2 + palaceStrokeWidth],
        [-palaceStrokeWidth * 2, -palaceStrokeWidth * 2],
      ],
      text: {
        x: -palaceStrokeWidth * 2 - fontSize / 2,
        y: -palaceStrokeWidth * 2 - palaceStrokeWidth - fontSize,
      },
    },
    // 10
    {
      points: [
        [-palaceSide * 0.5 + palaceStrokeWidth * 1.5, -palaceSide * 2 + palaceStrokeWidth],
        [palaceSide * 0.5 - palaceStrokeWidth * 1, -palaceStrokeWidth * 2],
      ],
      text: {
        x: palaceSide * 0.5 - fontSize * 1.5,
        y: -palaceStrokeWidth * 2 - fontSize / 3,
      },
    },
    // 11
    {
      points: [
        [palaceSide * 1.5 - palaceStrokeWidth, -palaceSide * 2 + palaceStrokeWidth],
        [palaceSide * 0.5, -palaceStrokeWidth * 2],
      ],
      text: {
        x: palaceSide * 0.5 + fontSize * 1.5,
        y: -palaceStrokeWidth * 2 - fontSize / 3,
      },
    },
  ];

  const getPalaceFill = (palace: PalaceModel) => {
    if (flyingPalaceKey === palace.key) {
      return palaceFlyFill;
    }
    if (horoscopeIndex === palace.index) {
      return palaceHoroscopeFill;
    }
    return boardFill;
  };

  return (
    <svg width={width} height={height} ref={ref}>
      <title>紫微斗数</title>
      <g>
        <rect width={width} height={width} fill={boardFill} />
        <rect
          x={boardX}
          y={boardY}
          width={boardSide}
          height={boardSide}
          fill={boardFill}
          stroke={boardStroke}
          strokeWidth={boardStrokeWidth}
        />
        {person.palaces.map((palace, index) => {
          const currentTransformations = starsTransformation[index];

          const hasCP = currentTransformations.length > 0;

          return (
            <Palace
              key={palace.key}
              name={palace.name}
              width={palaceSide}
              height={palaceSide}
              x={coordinates[index].x}
              y={coordinates[index].y}
              fill={getPalaceFill(palace)}
              onClick={() => {
                if (flyingPalaceKey === palace.key) {
                  setFlyingTransformations([]);
                  setFlyingPalaceKey(undefined);
                } else {
                  setFlyingTransformations(palace.$starKeysByFlying());
                  setFlyingPalaceKey(palace.key);
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                selectedRef.current = index;
                setMenuPosition({ x: e.clientX, y: e.clientY });
              }}
              onLongPress={(e) => {
                if (e instanceof MouseEvent) {
                  selectedRef.current = index;
                  setMenuPosition({ x: e.clientX, y: e.clientY });
                }

                if (e instanceof TouchEvent) {
                  selectedRef.current = index;
                  setMenuPosition({
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                  });
                }
              }}
            >
              {/* 宫位信息 */}
              {palace.isLaiYin && <LaiYin x={laiYinFlagX} y={laiYinFlagY} type="D" />}
              {/* 宫位信息 - 干支 */}
              <svg x={0} y={verticalRectHeight * 2} overflow="visible">
                <title>干支</title>
                <rect
                  width={verticalRectWidth}
                  height={verticalRectHeight}
                  fill="transparent"
                  stroke={boardStroke}
                  strokeWidth={palaceStrokeWidth}
                />
                <text
                  x={verticalRectWidth / 2}
                  y={horizontalRectHeight - fontSize}
                  writingMode="vertical-rl"
                  fontSize={fontSize}
                  letterSpacing={0}
                  wordSpacing={0}
                >
                  {palace.stem}
                  {palace.branch}
                </text>
              </svg>
              {/* 宫位信息 - 大限宫职 */}
              <svg x={verticalRectWidth} y={verticalRectHeight * 2} overflow="visible">
                <title>大限宫职</title>
                <rect
                  width={horizontalRectWidth}
                  height={horizontalRectHeight}
                  fill="transparent"
                  stroke={boardStroke}
                  strokeWidth={palaceStrokeWidth}
                />
                <text
                  x={horizontalRectWidth / 2 - fontSize}
                  y={
                    fontSize * fontLineHeight -
                    (horizontalRectHeight - fontSize * fontLineHeight) / 2
                  }
                  fontSize={fontSize}
                  letterSpacing={0}
                  wordSpacing={0}
                >
                  {horoscope[index]?.palaceName}
                </text>
              </svg>
              {/* 宫位信息 - 运限间隔 */}
              <svg x={verticalRectWidth} y={verticalRectHeight * 2.5} overflow="visible">
                <title>运限间隔</title>
                <rect
                  width={horizontalRectWidth}
                  height={horizontalRectHeight}
                  fill="transparent"
                  stroke={boardStroke}
                  strokeWidth={palaceStrokeWidth}
                />
                <text
                  x={horizontalRectWidth / 2}
                  y={horizontalRectHeight / 2 + fontLineHeight}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={horoscopeRangesFontSize}
                  letterSpacing={0}
                  wordSpacing={0}
                >
                  {palace.horoscopeRanges.join(" ~ ")}
                </text>
              </svg>
              {/* 宫位信息 - 原局宫职 */}
              <svg x={verticalRectWidth * 5} y={verticalRectHeight * 2} overflow="visible">
                <title>干支</title>
                <rect
                  width={verticalRectWidth}
                  height={verticalRectHeight}
                  fill="transparent"
                  stroke={boardStroke}
                  strokeWidth={palaceStrokeWidth}
                />
                <text
                  x={verticalRectWidth / 2}
                  y={horizontalRectHeight - fontSize}
                  writingMode="vertical-rl"
                  fontSize={fontSize}
                  letterSpacing={0}
                  wordSpacing={0}
                >
                  {palace.name}
                </text>
              </svg>
              {/* 流年 */}
              {horoscope[index]?.yearlyText && (
                <text
                  x={palaceSide / 2}
                  y={verticalRectHeight * 2 - yearlyFontSize / 2}
                  fontSize={yearlyFontSize}
                  letterSpacing={0}
                  wordSpacing={0}
                  textAnchor="middle"
                >
                  {horoscope[index].yearlyText}
                </text>
              )}
              {/* 星辰信息 */}
              <Stars
                x={palaceSide - palacePadding - fontSize * fontLineHeight}
                y={palacePadding}
                palace={palace}
                data={stars[index]}
              />
              {/* 向心自化部分 */}
              {hasCP && _CP[index] && (
                <g>
                  <ArrowLine
                    points={_CP[index].points}
                    arrowSize={arrowSize}
                    stroke={selfTransformationStroke}
                    strokeWidth={palaceStrokeWidth}
                  />
                  <text
                    x={_CP[index].text.x}
                    y={_CP[index].text.y}
                    fontSize={selfTransformationFontSize}
                    fill={selfTransformationStroke}
                    textAnchor="middle"
                  >
                    {currentTransformations.map((item) => item.key).join("")}
                  </text>
                </g>
              )}
            </Palace>
          );
        })}
        <CentralPalace
          x={centralPalaceX}
          y={centralPalaceY}
          width={centralPalaceSide}
          height={centralPalaceSide}
          name={person.name}
          gender={person.gender}
          fiveElementName={person.fiveElementName}
          lunisolarDate={person.lunisolarDate}
          solarDate={person.solarDate}
          solarDateByTrue={person.solarDateByTrue}
          sexagenaryCycleDate={person.sexagenaryCycleDate}
        />
      </g>
      <Activity mode={menuPosition.x > 0 && menuPosition.y > 0 ? "visible" : "hidden"}>
        <ContextMenu
          x={menuPosition.x}
          y={menuPosition.y}
          menuItems={[
            {
              label: "入限",
              onClick: () => {
                setHoroscope(person.getHoroscope(selectedRef.current).palaces);
                setHoroscopeIndex(selectedRef.current);
              },
            },
          ]}
          onClose={() => {
            setMenuPosition({ x: 0, y: 0 });
          }}
        />
      </Activity>
    </svg>
  );
}
