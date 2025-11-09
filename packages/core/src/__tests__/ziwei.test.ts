import { LunarHour } from "tyme4ts";
import { afterEach, describe, expect, test, vi } from "vitest";
import * as Engine from "../core/engine";
import i18n from "../i18n";
import * as DateTools from "../tools/date";
import { byLunisolar, bySolar } from "../ziwei";

const createLunarHourStub = ({
  year = 1990,
  solarTime = new Date("1990-01-01T00:00:00Z"),
  eightChar = "甲子年",
}: {
  year?: number;
  solarTime?: Date;
  eightChar?: string;
} = {}) =>
  ({
    getYear: vi.fn(() => year),
    getEightChar: vi.fn(() => ({ toString: () => eightChar })),
    getSolarTime: vi.fn(() => solarTime),
  }) as unknown as LunarHour;

describe("ziwei", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("bySolar 使用真太阳时并透传格式化后的日期字段", () => {
    const baseDate = new Date("2024-02-03T04:05:06Z");
    const trueSolarDate = new Date("2024-02-03T05:05:06Z");
    const fakeLunarHour = createLunarHourStub({ year: 1988, eightChar: "辛卯年" });
    const astrolabeDateResult: DateTools.FixedLunarDate = {
      stemKey: "JIA",
      branchKey: "ZI",
      year: 2024,
      monthIndex: 1,
      day: 12,
      hourIndex: 3,
    };

    const setLanguageSpy = vi.spyOn(i18n, "setCurrentLanguage");
    const trueSolarSpy = vi
      .spyOn(DateTools, "calculateTrueSolarTime")
      .mockReturnValue(trueSolarDate);
    const lunisolarSpy = vi
      .spyOn(DateTools, "calculateLunisolarDateBySolar")
      .mockReturnValue(fakeLunarHour);
    const astrolabeDateSpy = vi
      .spyOn(DateTools, "calculateAstrolabeDateBySolar")
      .mockReturnValue(astrolabeDateResult);
    vi.spyOn(DateTools, "getLunisolarDateText").mockReturnValue("LUNAR_TEXT");
    vi.spyOn(DateTools, "getSolarDateText").mockImplementation(
      (value) => `SOLAR:${(value as Date).toISOString()}`,
    );
    const calculateAstrolabeSpy = vi
      .spyOn(Engine, "calculateAstrolabe")
      .mockReturnValue({ marker: "astrolabe" } as never);

    const result = bySolar({
      name: "tester",
      gender: "male",
      date: baseDate,
      longitude: 121.5,
      timezoneOffset: 9,
      useTrueSolarTime: true,
      language: "zh-Hant",
    });

    expect(result).toEqual({ marker: "astrolabe" });
    expect(setLanguageSpy).toHaveBeenCalledWith("zh-Hant");
    expect(trueSolarSpy).toHaveBeenCalledWith(baseDate, 121.5, 9);
    expect(lunisolarSpy).toHaveBeenCalledWith(trueSolarDate);
    expect(astrolabeDateSpy).toHaveBeenCalledWith({
      date: fakeLunarHour,
      globalConfigs: expect.objectContaining({
        _yearDivision: expect.any(String),
      }),
    });

    const payload = calculateAstrolabeSpy.mock.calls.at(-1)?.[0];
    expect(payload).toEqual({
      name: "tester",
      gender: "male",
      monthIndex: astrolabeDateResult.monthIndex,
      day: astrolabeDateResult.day,
      hourIndex: astrolabeDateResult.hourIndex,
      birthYear: 1988,
      birthYearStemKey: astrolabeDateResult.stemKey,
      birthYearBranchKey: astrolabeDateResult.branchKey,
      solarDate: `SOLAR:${baseDate.toISOString()}`,
      solarDateByTrue: `SOLAR:${trueSolarDate.toISOString()}`,
      lunisolarDate: "LUNAR_TEXT",
      sexagenaryCycleDate: "辛卯年",
    });
  });

  test("bySolar 在未启用真太阳时时保留原始时间值", () => {
    const baseDate = new Date("2024-05-01T08:00:00Z");
    const trueSolarDate = new Date("2024-05-01T08:30:00Z");
    const fakeLunarHour = createLunarHourStub();

    vi.spyOn(DateTools, "calculateTrueSolarTime").mockReturnValue(trueSolarDate);
    const lunisolarSpy = vi
      .spyOn(DateTools, "calculateLunisolarDateBySolar")
      .mockReturnValue(fakeLunarHour);
    vi.spyOn(DateTools, "calculateAstrolabeDateBySolar").mockReturnValue({
      stemKey: "YI",
      branchKey: "CHOU",
      monthIndex: 5,
      day: 20,
      hourIndex: 7,
      year: 2024,
    });
    vi.spyOn(DateTools, "getSolarDateText").mockImplementation(
      (value) => `SOLAR:${(value as Date).toISOString()}`,
    );
    vi.spyOn(DateTools, "getLunisolarDateText").mockReturnValue("LUNAR_TEXT");
    const calculateAstrolabeSpy = vi
      .spyOn(Engine, "calculateAstrolabe")
      .mockReturnValue({} as never);

    bySolar({
      name: "fallback",
      gender: "female",
      date: baseDate,
      longitude: 118,
      timezoneOffset: 8,
      useTrueSolarTime: false,
    });

    expect(lunisolarSpy).toHaveBeenCalledWith(baseDate);
    const payload = calculateAstrolabeSpy.mock.calls.at(-1)?.[0];
    expect(payload?.solarDate).toBe(`SOLAR:${baseDate.toISOString()}`);
    expect(payload?.solarDateByTrue).toBe(`SOLAR:${baseDate.toISOString()}`);
  });

  test("bySolar 在经度为0时直接跳过真太阳时计算", () => {
    const baseDate = new Date("2024-07-10T10:00:00Z");
    const fakeLunarHour = createLunarHourStub();

    const trueSolarSpy = vi.spyOn(DateTools, "calculateTrueSolarTime");
    const lunisolarSpy = vi
      .spyOn(DateTools, "calculateLunisolarDateBySolar")
      .mockReturnValue(fakeLunarHour);
    vi.spyOn(DateTools, "calculateAstrolabeDateBySolar").mockReturnValue({
      stemKey: "BING",
      branchKey: "YIN",
      monthIndex: 7,
      day: 5,
      hourIndex: 2,
      year: 2024,
    });
    vi.spyOn(DateTools, "getSolarDateText").mockImplementation(
      (value) => `SOLAR:${(value as Date).toISOString()}`,
    );
    vi.spyOn(DateTools, "getLunisolarDateText").mockReturnValue("LUNAR");
    const calculateAstrolabeSpy = vi
      .spyOn(Engine, "calculateAstrolabe")
      .mockReturnValue({} as never);

    bySolar({
      name: "noLongitude",
      gender: "male",
      date: baseDate,
      longitude: 0,
    });

    expect(trueSolarSpy).not.toHaveBeenCalled();
    expect(lunisolarSpy).toHaveBeenCalledWith(baseDate);
    const payload = calculateAstrolabeSpy.mock.calls.at(-1)?.[0];
    expect(payload?.solarDate).toBe(`SOLAR:${baseDate.toISOString()}`);
    expect(payload?.solarDateByTrue).toBe(`SOLAR:${baseDate.toISOString()}`);
  });

  test("byLunisolar 会根据时辰索引与八字信息排盘", () => {
    const fakeSolarTime = new Date("2030-08-18T22:15:30Z");
    const fakeLunarHour = createLunarHourStub({
      year: 2030,
      solarTime: fakeSolarTime,
      eightChar: "庚午年",
    });
    const hourSpy = vi.spyOn(DateTools, "calculateHourByIndex").mockReturnValue([22, 15, 30]);
    const lunarFromSpy = vi.spyOn(LunarHour, "fromYmdHms").mockReturnValue(fakeLunarHour);
    const astrolabeDateSpy = vi.spyOn(DateTools, "calculateAstrolabeDate").mockReturnValue({
      stemKey: "GENG",
      branchKey: "WU",
      monthIndex: 6,
      day: 18,
      hourIndex: 4,
    });
    vi.spyOn(DateTools, "getSolarDateText").mockImplementation(
      (value) => `SOLAR:${(value as Date).toISOString()}`,
    );
    vi.spyOn(DateTools, "getLunisolarDateText").mockReturnValue("LUNISOLAR_TEXT");
    const calculateAstrolabeSpy = vi
      .spyOn(Engine, "calculateAstrolabe")
      .mockReturnValue({ marker: "lunisolar" } as never);
    const setLanguageSpy = vi.spyOn(i18n, "setCurrentLanguage");

    const result = byLunisolar({
      name: "tester",
      gender: "male",
      date: "2030-8-18-9",
      language: "zh-CN",
    });

    expect(result).toEqual({ marker: "lunisolar" });
    expect(setLanguageSpy).toHaveBeenCalledWith("zh-CN");
    expect(hourSpy).toHaveBeenCalledWith(9);
    expect(lunarFromSpy).toHaveBeenCalledWith(2030, 8, 18, 22, 15, 30);
    expect(astrolabeDateSpy).toHaveBeenCalledWith("2030-8-18-9");

    const payload = calculateAstrolabeSpy.mock.calls.at(-1)?.[0];
    expect(payload).toEqual({
      name: "tester",
      gender: "male",
      monthIndex: 6,
      day: 18,
      hourIndex: 4,
      birthYear: 2030,
      birthYearStemKey: "GENG",
      birthYearBranchKey: "WU",
      solarDate: `SOLAR:${fakeSolarTime.toISOString()}`,
      solarDateByTrue: undefined,
      lunisolarDate: "LUNISOLAR_TEXT",
      sexagenaryCycleDate: "庚午年",
    });
  });
});
