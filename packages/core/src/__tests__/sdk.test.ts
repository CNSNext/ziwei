import { describe, expect, it } from "vitest";
import { getGlobalConfigs } from "../infra/configs";
import { createZiWeiByLunisolar, createZiWeiBySolar, createZiWeiRuntime } from "../sdk";
import type { CreateZiWeiLunisolarParams, CreateZiWeiSolarParams } from "../typings";

const solarParams: CreateZiWeiSolarParams = {
  name: "测试命主",
  gender: "Yang",
  date: new Date("1993-08-08T08:00:00+08:00"),
  longitude: 116.38333,
  timezone: 8,
  useTrueSolarTime: true,
};

const lunisolarParams: CreateZiWeiLunisolarParams = {
  name: "测试命主",
  gender: "Yang",
  date: "1999-1-5-3",
};

describe("sdk/createZiWei", () => {
  it("允许通过运行时选项注入全局配置（阳历）", () => {
    const withMinorStars = createZiWeiBySolar(solarParams);
    const onlyMajorStars = createZiWeiBySolar(solarParams, {
      configs: getGlobalConfigs({ star: "onlyMajor" }),
    });

    const hasMinorStars = withMinorStars.palaces.some((palace) =>
      palace.stars.some((star) => star.type === "minor"),
    );
    const hasMinorWhenOnlyMajor = onlyMajorStars.palaces.some((palace) =>
      palace.stars.some((star) => star.type === "minor"),
    );

    expect(hasMinorStars).toBe(true);
    expect(hasMinorWhenOnlyMajor).toBe(false);
  });

  it("允许通过运行时选项注入全局配置（阴历）", () => {
    const withMinorStars = createZiWeiByLunisolar(lunisolarParams);
    const onlyMajorStars = createZiWeiByLunisolar(lunisolarParams, {
      configs: getGlobalConfigs({ star: "onlyMajor" }),
    });

    const hasMinorStars = withMinorStars.palaces.some((palace) =>
      palace.stars.some((star) => star.type === "minor"),
    );
    const hasMinorWhenOnlyMajor = onlyMajorStars.palaces.some((palace) =>
      palace.stars.some((star) => star.type === "minor"),
    );

    expect(hasMinorStars).toBe(true);
    expect(hasMinorWhenOnlyMajor).toBe(false);
  });

  it("在同时传入运行时选项和调用选项时优先使用调用选项覆盖 referenceDate", () => {
    const runtimeOptions = {
      configs: getGlobalConfigs(),
      now: () => new Date("2035-01-01T00:00:00+08:00"),
    };
    const referenceDate = new Date("2010-02-12T00:00:00+08:00");

    const natalWithRuntimeNow = createZiWeiBySolar(solarParams, runtimeOptions);
    const natalWithReferenceDate = createZiWeiBySolar(
      { ...solarParams, referenceDate },
      runtimeOptions,
    );

    expect(natalWithRuntimeNow.decade).not.toEqual(natalWithReferenceDate.decade);
  });

  it("可以复用外部构造的 runtime 并继续接收调用选项", () => {
    const runtime = createZiWeiRuntime({ configs: getGlobalConfigs({ star: "onlyMajor" }) });
    const referenceDate = new Date("2010-02-12T00:00:00+08:00");

    const natal = createZiWeiBySolar({ ...solarParams, referenceDate }, { runtime });

    const hasMinorStars = natal.palaces.some((palace) =>
      palace.stars.some((star) => star.type === "minor"),
    );

    expect(hasMinorStars).toBe(false);
    expect(natal.decade.some((item) => item.yearly.age !== 0)).toBe(true);
  });
});
