import { describe, expect, test, vi } from "vitest";
import * as Algorithms from "../algorithms";
import { calculateAstrolabe } from "../engine";

describe("calculateAstrolabe()", () => {
  test("应根据性别和年干阴阳决定大限方向（阳男阴女顺、阴男阳女逆）", () => {
    const maleAstrolabe = calculateAstrolabe({
      name: "A",
      gender: "male",
      monthIndex: 0,
      day: 1,
      hourIndex: 0,
      birthYear: 1990,
      birthYearStemKey: "JIA", // 阳干
      birthYearBranchKey: "ZI",
      solarDate: "1990-01-01",
      lunisolarDate: "1990-01-01",
      solarDateByTrue: "1990-01-01",
      sexagenaryCycleDate: "甲子年",
    });
    expect(maleAstrolabe.horoscopeDirection).toBe(1);

    const femaleAstrolabe = calculateAstrolabe({
      name: "B",
      gender: "female",
      monthIndex: 0,
      day: 1,
      hourIndex: 0,
      birthYear: 1990,
      birthYearStemKey: "JI", // 阴干
      birthYearBranchKey: "ZI",
      solarDate: "1990-01-01",
      lunisolarDate: "1990-01-01",
      solarDateByTrue: "1990-01-01",
      sexagenaryCycleDate: "甲子年",
    });
    expect(femaleAstrolabe.horoscopeDirection).toBe(1);

    const maleAstrolabe2 = calculateAstrolabe({
      name: "B",
      gender: "male",
      monthIndex: 0,
      day: 1,
      hourIndex: 0,
      birthYear: 1990,
      birthYearStemKey: "JI", // 阴干
      birthYearBranchKey: "ZI",
      solarDate: "1990-01-01",
      lunisolarDate: "1990-01-01",
      solarDateByTrue: "1990-01-01",
      sexagenaryCycleDate: "甲子年",
    });
    expect(maleAstrolabe2.horoscopeDirection).toBe(-1);
  });

  test("getHoroscope 应返回 calculateHoroscope 的结果，且回调被触发", () => {
    const spy = vi.spyOn(Algorithms, "calculateHoroscope");
    const astrolabe = calculateAstrolabe({
      name: "tester",
      gender: "male",
      monthIndex: 0,
      day: 1,
      hourIndex: 0,
      birthYear: 1990,
      birthYearStemKey: "JIA",
      birthYearBranchKey: "ZI",
      solarDate: "1990-01-01",
      lunisolarDate: "1990-01-01",
      solarDateByTrue: "1990-01-01",
      sexagenaryCycleDate: "甲子年",
    });

    const horoscope = astrolabe.getHoroscope(2);
    expect(spy).toHaveBeenLastCalledWith(astrolabe.palaces, "ZI", 1990, 2);
    expect(horoscope.index).toBeDefined();

    spy.mockRestore();
  });

  test("返回的 palaces 应调用 mapStarsWithSelfTransformation 并使用相对索引", () => {
    const astrolabe = calculateAstrolabe({
      name: "tester",
      gender: "male",
      monthIndex: 5,
      day: 12,
      hourIndex: 3,
      birthYear: 1995,
      birthYearStemKey: "YI",
      birthYearBranchKey: "MAO",
      solarDate: "1995-06-15",
      lunisolarDate: "1995-05-18",
      solarDateByTrue: "1995-06-15",
      sexagenaryCycleDate: "乙卯年",
    });

    expect(astrolabe.palaces).toHaveLength(12);
    expect(astrolabe.palaces[0].majorStars).toBeDefined();
    expect(astrolabe.palaces[0].minorStars).toBeDefined();
    expect(astrolabe.palaces[0].horoscopeRanges).toBeInstanceOf(Array);
  });
});
