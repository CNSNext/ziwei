import { _minorStars, type Palace, type StarKey, type Star as StarModel } from "@ziweijs/core";
import { use, useCallback, useMemo } from "react";
import { ConfigContext } from "../context/config";
import Star from "./Star";

export interface StarsProps {
  data: StarModel[];
  x: number;
  y: number;
  palace: Palace;
}

export default function Stars({ data, x, y, palace }: StarsProps) {
  const { fontSize, fontLineHeight, fontColor, ziweiColor, minorStarColor } = use(ConfigContext);

  const starColor = useCallback(
    (starKey: StarKey) => {
      if (starKey === "ZI_WEI") {
        return ziweiColor;
      }
      if (_minorStars.includes(starKey)) {
        return minorStarColor;
      }
      return fontColor;
    },
    [ziweiColor, fontColor, minorStarColor],
  );

  const onlyCfData = useMemo(() => data.filter((item) => item.ST?.CF), [data]);

  return (
    <g>
      {data.map((star, i) => {
        const index = onlyCfData.indexOf(star);
        return (
          <Star
            {...star}
            index={index > -1 ? index : 0}
            starKey={star.key}
            key={star.key}
            x={x - fontLineHeight * fontSize * i}
            y={y}
            fill={starColor(star.key)}
            palace={palace}
          />
        );
      })}
    </g>
  );
}
