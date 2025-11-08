import { describe, expect, test, vi } from "vitest";
import * as Algorithms from "../../core/algorithms";
import { calculateAstrolabe } from "../../core/engine";
import type { AstrolabeProps } from "../../typings";
import { createAstrolabe } from "../astrolabe";

const sampleAstrolabe = calculateAstrolabe({
  name: "tester",
  gender: "male",
  monthIndex: 0,
  day: 1,
  hourIndex: 0,
  birthYear: 1990,
  birthYearStemKey: "JIA",
  birthYearBranchKey: "ZI",
  solarDate: "1990-01-01",
  solarDateByTrue: "1990-01-01",
  lunisolarDate: "1990-01-01",
  sexagenaryCycleDate: "甲子年",
});

const { getHoroscope: _omit, ...restProps } = sampleAstrolabe as AstrolabeProps & {
  getHoroscope?: unknown;
};
const baseProps = restProps as AstrolabeProps;

describe("createAstrolabe()", () => {
  test("返回对象应携带原始属性并包含 getHoroscope 方法", () => {
    const astrolabe = createAstrolabe(baseProps);
    expect(astrolabe.name).toBe(baseProps.name);
    expect(typeof astrolabe.getHoroscope).toBe("function");
  });

  test("调用 getHoroscope 时应委托 calculateHoroscope 并透传参数", () => {
    const spy = vi.spyOn(Algorithms, "calculateHoroscope");
    const astrolabe = createAstrolabe(baseProps);

    astrolabe.getHoroscope(4);
    expect(spy).toHaveBeenLastCalledWith(baseProps.palaces, "ZI", 1990, 4);

    astrolabe.getHoroscope();
    const [, , , receivedIndex] = spy.mock.calls.at(-1) ?? [];
    expect(receivedIndex).toBeUndefined();

    spy.mockRestore();
  });
});
