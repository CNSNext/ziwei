import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import * as Configs from "../../configs";
import * as Constants from "../../constants";
import {
  _branchKeys,
  _fiveElementNumMaps,
  _palaceKeys,
  _stemKeys,
  _transformationKeys,
  _yearToMonthMap,
} from "../../constants";
import i18n from "../../i18n";
import { createPalace } from "../../models/palace";
import { createStar } from "../../models/star";
import * as DateTools from "../../tools/date";
import type {
  BranchKey,
  BranchName,
  PalaceName,
  StarAbbrName,
  StarName,
  StemKey,
  StemName,
} from "../../typings";
import {
  calculateCurrentPalaceIndex,
  calculateFiveElementNum,
  calculateHoroscope,
  calculateHoroscopePalaces,
  calculateMainPalaceIndex,
  calculateMajorPeriodRanges,
  calculateMajorStars,
  calculateMinorStars,
  calculatePalaceStemsAndBranches,
  calculateStarIndex,
  calculateStarTransformation,
  getHourIndex,
  getMinorStarIndices,
  isLaiYin,
  mapStarsWithSelfTransformation,
} from "../algorithms";

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("calculatePalaceStemsAndBranches()", () => {
  test("应该返回正确的十二宫干支（有效的stemKey）", () => {
    const result = calculatePalaceStemsAndBranches("BING");
    expect(result).toEqual(_yearToMonthMap.BING);
  });
});

describe("calculateMainPalaceIndex()", () => {
  test("应该正确计算命宫索引 - 月索引为 1，时索引为 0", () => {
    // 二月子时
    const result = calculateMainPalaceIndex(1, 0);
    expect(result).toBe(1);
  });

  test("应该正确计算命宫索引 - 月索引为 3，时索引为 2", () => {
    // 四月丑时
    const result = calculateMainPalaceIndex(3, 2);
    expect(result).toBe(1);
  });

  test("应该正确处理负索引 - 月索引为 0，时索引为 10", () => {
    // 正月戌时
    const result = calculateMainPalaceIndex(0, 10);
    expect(result).toBe(2); // 期待结果为 2
  });

  test("应该正确处理月索引和时索引相等的情况", () => {
    // 六月巳时
    const result = calculateMainPalaceIndex(5, 5);
    expect(result).toBe(0); // 期待结果为 0
  });
});

describe("calculateCurrentPalaceIndex()", () => {
  test("应该正确计算当前宫位索引 - 命宫索引为 0，当前宫位索引为 2", () => {
    expect(calculateCurrentPalaceIndex(0, 2)).toBe(10);
  });
  test("应该正确计算当前宫位索引 - 命宫索引为 3，当前宫位索引为 8", () => {
    expect(calculateCurrentPalaceIndex(3, 8)).toBe(7);
  });
  test("应该正确处理负索引 - 命宫索引为 10，当前宫位索引为 2", () => {
    expect(calculateCurrentPalaceIndex(10, 2)).toBe(8);
  });
  test("应该正确处理命宫索引和当前宫位索引相等的情况", () => {
    expect(calculateCurrentPalaceIndex(4, 4)).toBe(0);
  });
});

describe("calculateStarIndex()", () => {
  test("应该正确处理日数与五行局数可除尽的情况", () => {
    const result = calculateStarIndex(20, 4);
    expect(result).toEqual({ ziweiIndex: 4, tianfuIndex: 8 });
  });
  test("应该正确处理日数与五行局数无法除尽的情况", () => {
    const result = calculateStarIndex(1, 6);
    expect(result).toEqual({ ziweiIndex: 7, tianfuIndex: 5 });
  });
});

describe("getMinorStarIndices()", () => {
  test("应该正确计算左辅、右弼、文昌、文曲的索引 - 月索引为 3，时索引为 5", () => {
    expect(getMinorStarIndices(3, 5)).toEqual({
      zuofuIndex: 5,
      youbiIndex: 5,
      wenchangIndex: 3,
      wenquIndex: 7,
    });
  });

  test("应该正确处理负索引 - 月索引为 0，时索引为 10", () => {
    expect(getMinorStarIndices(0, 10)).toEqual({
      zuofuIndex: 2,
      youbiIndex: 8,
      wenchangIndex: 10,
      wenquIndex: 0,
    });
  });

  test("应该正确处理月索引和时索引相等的情况", () => {
    expect(getMinorStarIndices(5, 5)).toEqual({
      zuofuIndex: 7,
      youbiIndex: 3,
      wenchangIndex: 3,
      wenquIndex: 7,
    });
  });
});

// describe("calculateMajorStars()", () => {

// });

describe("calculateFiveElementNum()", () => {
  test("应返回正确的五行局信息", () => {
    const result = calculateFiveElementNum("JIA", "ZI");
    expect(result).toEqual({
      fiveElementNumKey: "METAL",
      fiveElementNumIndex: 1,
      fiveElementNumName: i18n.$t("fiveElementNum.METAL"),
      fiveElementNumValue: _fiveElementNumMaps.METAL,
    });
  });
});

describe("calculateStarTransformation()", () => {
  test("存在化曜映射时应返回对应的化曜信息", () => {
    const transformation = calculateStarTransformation("JIA", "LIAN_ZHEN");
    expect(transformation).toEqual({
      key: _transformationKeys[0],
      name: i18n.$t(`transformation.${_transformationKeys[0]}`),
    });
  });

  test("无映射的星曜应返回 undefined", () => {
    expect(calculateStarTransformation("JIA", "ZUO_FU")).toBeUndefined();
  });
});

describe("calculateMajorStars()", () => {
  test("应将主星安置到正确宫位并带有化曜", () => {
    const result = calculateMajorStars({
      ziweiIndex: 0,
      tianfuIndex: 6,
      birthYearStemKey: "JIA",
    });

    expect(result).toHaveLength(12);
    expect(result[0].some((star) => star.key === "ZI_WEI")).toBe(true);
    expect(result[6].some((star) => star.key === "TIAN_FU")).toBe(true);

    const lianZhen = result.flat().find((star) => star.key === "LIAN_ZHEN");
    expect(lianZhen?.YT?.key).toBe(_transformationKeys[0]);
  });
});

describe("calculateMinorStars()", () => {
  test("应根据月索引与时辰安置左右昌曲", () => {
    const monthIndex = 3;
    const hourIndex = 6;
    const stars = calculateMinorStars({
      monthIndex,
      hourIndex,
      birthYearStemKey: "JIA",
    });
    const flattened = stars.flat();
    const keys = flattened.map((star) => star.key).sort();
    expect(keys).toEqual(["WEN_CHANG", "WEN_QU", "YOU_BI", "ZUO_FU"]);

    const { zuofuIndex, youbiIndex, wenchangIndex, wenquIndex } = getMinorStarIndices(
      monthIndex,
      hourIndex,
    );
    expect(stars[zuofuIndex].some((star) => star.key === "ZUO_FU")).toBe(true);
    expect(stars[youbiIndex].some((star) => star.key === "YOU_BI")).toBe(true);
    expect(stars[wenchangIndex].some((star) => star.key === "WEN_CHANG")).toBe(true);
    expect(stars[wenquIndex].some((star) => star.key === "WEN_QU")).toBe(true);
  });

  test("当 starKey 为空时应该跳过创建，确保返回数组为空宫", () => {
    const spy = vi.spyOn(Constants, "createMetaMinorStars");
    spy.mockReturnValue([{ starKey: undefined, startIndex: 0, direction: 1, galaxy: undefined }]);
    const stars = calculateMinorStars({
      monthIndex: 0,
      hourIndex: 0,
      birthYearStemKey: "JIA",
    });
    expect(stars.flat()).toHaveLength(0);
    spy.mockRestore();
  });
});

describe("mapStarsWithSelfTransformation()", () => {
  test("应为星曜补充 CF/CP 自化信息", () => {
    const lianzhen = createStar({
      key: "LIAN_ZHEN",
      name: i18n.$t("star.LIAN_ZHEN.name") as StarName,
      abbrName: i18n.$t("star.LIAN_ZHEN.abbr") as StarAbbrName,
      type: "major",
      galaxy: "N",
    });
    const zuofu = createStar({
      key: "ZUO_FU",
      name: i18n.$t("star.ZUO_FU.name") as StarName,
      abbrName: i18n.$t("star.ZUO_FU.abbr") as StarAbbrName,
      type: "minor",
      galaxy: "C",
    });
    const pojun = createStar({
      key: "PO_JUN",
      name: i18n.$t("star.PO_JUN.name") as StarName,
      abbrName: i18n.$t("star.PO_JUN.abbr") as StarAbbrName,
      type: "major",
      galaxy: "S",
    });
    const stars = [lianzhen, zuofu, pojun];

    const mapped = mapStarsWithSelfTransformation({
      stars,
      stemKey: "JIA",
      oppositeStemKey: "REN",
    });

    // 函数会在原对象上追加 ST，返回引用应保持不变
    expect(mapped[0]).toBe(lianzhen);

    // JIA 干对应的化曜表中含有 LIAN_ZHEN，CF 应存在，CP 因不在 REN 列表中而为空
    expect(mapped[0].ST?.CF?.key).toBe(_transformationKeys[0]);
    expect(mapped[0].ST?.CP).toBeUndefined();

    // opposite 干（REN）包含 ZUO_FU，CP 应存在，CF 不存在
    expect(mapped[1].ST?.CF).toBeUndefined();
    expect(mapped[1].ST?.CP?.key).toBe("C");

    // 两边都不包含的星辰保持 undefined
    expect(mapped[2].ST?.CF).toEqual({
      key: "B",
      name: "权",
    });
    expect(mapped[2].ST?.CP).toBeUndefined();
  });
});

describe("calculateMajorPeriodRanges()", () => {
  test("顺行大限应按命宫顺序累计", () => {
    const ranges = calculateMajorPeriodRanges(0, 1, 3);
    expect(ranges[0]).toEqual([3, 12]);
    expect(ranges[1]).toEqual([13, 22]);
  });

  test("逆行大限应按相反方向推演", () => {
    const ranges = calculateMajorPeriodRanges(0, -1, 4);
    expect(ranges[0]).toEqual([4, 13]);
    expect(ranges[11]).toEqual([14, 23]);
  });
});

describe("calculateHoroscopePalaces() / calculateHoroscope()", () => {
  const mockPalaces = _palaceKeys.map((palaceKey, index) =>
    createPalace({
      index,
      key: palaceKey,
      name: i18n.$t(`palace.${palaceKey}.name`) as PalaceName,
      isLaiYin: false,
      stem: i18n.$t(`stem.${_stemKeys[index % _stemKeys.length]}`) as StemName,
      stemKey: _stemKeys[index % _stemKeys.length],
      branch: i18n.$t(`branch.${_branchKeys[index]}.name`) as BranchName,
      branchKey: _branchKeys[index],
      majorStars: [],
      minorStars: [],
      horoscopeRanges: [index * 10 + 3, index * 10 + 12],
    }),
  );

  test("应根据主宫与年支生成流年宫表", () => {
    const palaces = calculateHoroscopePalaces(mockPalaces, 0, _branchKeys[0], 1990);
    expect(palaces).toHaveLength(12);
    expect(palaces[2].age).toBe(3);
    expect(palaces[2].yearlyText).toContain(i18n.$t("year"));
  });

  test("指定 index 时 calculateHoroscope 应直接返回该宫位的流年", () => {
    const horoscope = calculateHoroscope(mockPalaces, _branchKeys[0], 1990, 2);
    expect(horoscope.index).toBe(2);
    expect(horoscope.palaces[2].palaceName).toBeTruthy();
  });

  test("未传 index 时应通过当前年份推算当前大限", () => {
    const getGlobalConfigsSpy = vi.spyOn(Configs, "getGlobalConfigs").mockReturnValue({
      _dayDivision: "normal",
      _monthDivision: "normal",
      _yearDivision: "normal",
    });
    const lunisolarSpy = vi
      .spyOn(DateTools, "calculateLunisolarDateBySolar")
      .mockReturnValue({} as never);
    const astroSpy = vi
      .spyOn(DateTools, "calculateAstrolabeDateBySolar")
      .mockReturnValue({ year: 1980 } as never);

    const horoscope = calculateHoroscope(mockPalaces, _branchKeys[0], 1970);
    expect(getGlobalConfigsSpy).toHaveBeenCalledTimes(1);
    expect(lunisolarSpy).toHaveBeenCalledTimes(1);
    expect(astroSpy).toHaveBeenCalledTimes(1);
    expect(horoscope.index).toBe(0);

    getGlobalConfigsSpy.mockRestore();
    lunisolarSpy.mockRestore();
    astroSpy.mockRestore();
  });

  test("当找不到匹配大限时应回退到命宫索引", () => {
    const getGlobalConfigsSpy = vi.spyOn(Configs, "getGlobalConfigs").mockReturnValue({
      _dayDivision: "normal",
      _monthDivision: "normal",
      _yearDivision: "normal",
    });
    const lunisolarSpy = vi
      .spyOn(DateTools, "calculateLunisolarDateBySolar")
      .mockReturnValue({} as never);
    const astroSpy = vi
      .spyOn(DateTools, "calculateAstrolabeDateBySolar")
      .mockReturnValue({ year: 2105 } as never);
    const fallbackPalaces = calculateHoroscopePalaces(mockPalaces, 0, _branchKeys[0], 1970);
    const horoscope = calculateHoroscope(mockPalaces, _branchKeys[0], 1970);

    expect(horoscope.index).toBe(0);
    expect(horoscope.palaces).toEqual(fallbackPalaces);

    getGlobalConfigsSpy.mockRestore();
    lunisolarSpy.mockRestore();
    astroSpy.mockRestore();
  });
});

describe("isLaiYin()", () => {
  /**
   * 核心规则验证：满足来因宫条件（年干=月干 + 地支≠子/丑）
   */
  test("年天干等于月天干且地支非子/丑时，应返回true", () => {
    // 场景1：年干=月干（甲=甲），地支=寅（非子/丑）
    expect(isLaiYin("JIA", "JIA", "YIN")).toBe(true);

    // 场景2：年干=月干（乙=乙），地支=卯（非子/丑）
    expect(isLaiYin("YI", "YI", "MAO")).toBe(true);

    // 场景3：年干=月干（丙=丙），地支=辰（非子/丑）
    expect(isLaiYin("BING", "BING", "CHEN")).toBe(true);

    // 场景4：覆盖所有非子/丑的地支（寅、卯、辰、巳、午、未、申、酉、戌、亥）
    const validBranches: BranchKey[] = [
      "YIN",
      "MAO",
      "CHEN",
      "SI",
      "WU",
      "WEI",
      "SHEN",
      "YOU",
      "XU",
      "HAI",
    ];
    validBranches.forEach((branch) => {
      expect(isLaiYin("JIA", "JIA", branch)).toBe(true);
    });
  });

  /**
   * 规则不满足场景1：年天干≠月天干（无论地支是否为子/丑）
   */
  test("年天干不等于月天干时，无论地支如何都返回false", () => {
    // 场景1：年干≠月干，地支=寅（非子/丑）
    expect(isLaiYin("JIA", "YI", "YIN")).toBe(false);

    // 场景2：年干≠月干，地支=子（子/丑）
    expect(isLaiYin("BING", "DING", "ZI")).toBe(false);

    // 场景3：年干≠月干，地支=丑（子/丑）
    expect(isLaiYin("WU", "JI", "CHOU")).toBe(false);

    // 场景4：覆盖所有天干组合不相等的情况
    const stems: StemKey[] = ["JIA", "YI", "BING", "DING", "WU", "JI", "GENG", "XIN", "REN", "GUI"];
    stems.forEach((yearStem, idx) => {
      // 取不同的月天干
      const monthStem = stems[(idx + 1) % stems.length];
      expect(isLaiYin(yearStem, monthStem, "YIN")).toBe(false);
    });
  });

  /**
   * 规则不满足场景2：年天干=月干，但地支=子/丑
   */
  test("年天干等于月天干但地支为子或丑时，返回false", () => {
    // 场景1：年干=月干，地支=子
    expect(isLaiYin("JIA", "JIA", "ZI")).toBe(false);

    // 场景2：年干=月干，地支=丑
    expect(isLaiYin("YI", "YI", "CHOU")).toBe(false);

    // 场景3：覆盖所有天干相等+地支子/丑的组合
    const stems: StemKey[] = ["JIA", "YI", "BING", "DING", "WU", "JI", "GENG", "XIN", "REN", "GUI"];
    stems.forEach((stem) => {
      expect(isLaiYin(stem, stem, "ZI")).toBe(false);
      expect(isLaiYin(stem, stem, "CHOU")).toBe(false);
    });
  });

  /**
   * 边界场景：验证所有天干和地支组合的完整性
   */
  test("覆盖所有天干地支组合，确保判断逻辑无遗漏", () => {
    const stems: StemKey[] = ["JIA", "YI", "BING", "DING", "WU", "JI", "GENG", "XIN", "REN", "GUI"];
    const branches: BranchKey[] = [
      "ZI",
      "CHOU",
      "YIN",
      "MAO",
      "CHEN",
      "SI",
      "WU",
      "WEI",
      "SHEN",
      "YOU",
      "XU",
      "HAI",
    ];

    // 遍历所有组合（10天干 × 10天干 × 12地支 = 1200种组合）
    stems.forEach((yearStem) => {
      stems.forEach((monthStem) => {
        branches.forEach((branch) => {
          // 核心判断逻辑（与函数实现一致，用于验证）
          const expected = yearStem === monthStem && !["ZI", "CHOU"].includes(branch);
          expect(isLaiYin(yearStem, monthStem, branch)).toBe(expected);
        });
      });
    });
  });
});

describe("getHourIndex()", () => {
  /**
   * 核心规则验证：子时特殊处理
   * 早子时（0点）→ 0，晚子时（23点）→ 12
   */
  test("子时特殊情况应返回正确索引", () => {
    // 早子时（0点）
    expect(getHourIndex(0)).toBe(0);
    // 晚子时（23点）
    expect(getHourIndex(23)).toBe(12);
  });

  /**
   * 完整时辰覆盖：验证1-22点每个小时对应的索引
   * 规则：每2小时一个时辰，(hour + 1) >> 1 等价于 Math.floor((hour + 1) / 2)
   */
  test("1-22点应按每2小时一个时辰的规则计算索引", () => {
    // 丑时：1-2点 → 索引1
    expect(getHourIndex(1)).toBe(1);
    expect(getHourIndex(2)).toBe(1);

    // 寅时：3-4点 → 索引2
    expect(getHourIndex(3)).toBe(2);
    expect(getHourIndex(4)).toBe(2);

    // 卯时：5-6点 → 索引3
    expect(getHourIndex(5)).toBe(3);
    expect(getHourIndex(6)).toBe(3);

    // 辰时：7-8点 → 索引4
    expect(getHourIndex(7)).toBe(4);
    expect(getHourIndex(8)).toBe(4);

    // 巳时：9-10点 → 索引5
    expect(getHourIndex(9)).toBe(5);
    expect(getHourIndex(10)).toBe(5);

    // 午时：11-12点 → 索引6
    expect(getHourIndex(11)).toBe(6);
    expect(getHourIndex(12)).toBe(6);

    // 未时：13-14点 → 索引7
    expect(getHourIndex(13)).toBe(7);
    expect(getHourIndex(14)).toBe(7);

    // 申时：15-16点 → 索引8
    expect(getHourIndex(15)).toBe(8);
    expect(getHourIndex(16)).toBe(8);

    // 酉时：17-18点 → 索引9
    expect(getHourIndex(17)).toBe(9);
    expect(getHourIndex(18)).toBe(9);

    // 戌时：19-20点 → 索引10
    expect(getHourIndex(19)).toBe(10);
    expect(getHourIndex(20)).toBe(10);

    // 亥时：21-22点 → 索引11
    expect(getHourIndex(21)).toBe(11);
    expect(getHourIndex(22)).toBe(11);
  });

  /**
   * 边界值测试：验证小时范围的临界值
   */
  test("小时范围临界值应返回正确结果", () => {
    // 最小小时数（0点）
    expect(getHourIndex(0)).toBe(0);
    // 0点的下一小时（1点）
    expect(getHourIndex(1)).toBe(1);
    // 22点（亥时结束）
    expect(getHourIndex(22)).toBe(11);
    // 23点（晚子时）
    expect(getHourIndex(23)).toBe(12);
  });

  /**
   * 异常输入测试：虽然函数设计为接收0-23的整数，但可验证对超出范围值的处理
   * （注：若业务层保证输入合法，此测试可作为容错性验证）
   */
  test("超出0-23范围的小时数应返回合理结果", () => {
    // 负数小时
    expect(getHourIndex(-1)).toBe((-1 + 1) >> 1); // 0 >> 1 → 0
    // 大于23的小时
    expect(getHourIndex(24)).toBe((24 + 1) >> 1); // 25 >> 1 → 12
    expect(getHourIndex(25)).toBe((25 + 1) >> 1); // 26 >> 1 → 13
  });
});
