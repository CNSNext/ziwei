import { SolarTime } from "tyme4ts";
import { describe, expect, it } from "vitest";
import { calculateLunisolarDateBySexagenary } from "../sexagenary";

describe("干支转阴历", () => {
  it("在给定 60 年周期内匹配四柱日期", () => {
    const targetSolar = SolarTime.fromYmdHms(1993, 8, 8, 8, 0, 0);
    const eightChar = targetSolar.getLunarHour().getEightChar().toString().replace(/\s+/g, "");

    const { solarTime, lunarHour } = calculateLunisolarDateBySexagenary(eightChar, {
      cycleStartYear: 1984,
    });

    expect(solarTime.getYear()).toBe(targetSolar.getYear());
    expect(solarTime.getMonth()).toBe(targetSolar.getMonth());
    expect(solarTime.getDay()).toBe(targetSolar.getDay());
    expect(solarTime.getHour()).toBe(targetSolar.getHour());
    expect(solarTime.getMinute()).toBe(targetSolar.getMinute());
    expect(lunarHour.getEightChar().toString().replace(/\s+/g, "")).toBe(eightChar);
  });

  it("解析无分隔符的四柱字符串", () => {
    const { solarTime } = calculateLunisolarDateBySexagenary("癸酉庚申辛酉壬辰", {
      cycleStartYear: 1984,
    });

    expect(solarTime.getYear()).toBe(1993);
    expect(solarTime.getMonth()).toBe(8);
    expect(solarTime.getDay()).toBe(8);
    expect(solarTime.getHour()).toBe(8);
  });

  it("识别同一干支在上一轮 60 年周期中的对应日期", () => {
    const targetSolar = SolarTime.fromYmdHms(1993, 8, 8, 8, 0, 0);
    const eightChar = targetSolar.getLunarHour().getEightChar().toString().replace(/\s+/g, "");

    const { solarTime } = calculateLunisolarDateBySexagenary(eightChar, {
      cycleStartYear: 1924,
    });

    expect(targetSolar.getYear() - solarTime.getYear()).toBe(60);
  });
});
