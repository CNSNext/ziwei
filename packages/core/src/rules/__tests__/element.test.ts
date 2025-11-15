import { describe, expect, it } from "vitest";
import { FIVE_ELEMENT_SCHEME } from "../../constants";
import { calculateFiveElementScheme } from "../element";

describe("rules/element", () => {
  it("returns 水二局 when命宫干支为甲寅", () => {
    const scheme = calculateFiveElementScheme("Jia", "Yin");

    expect(scheme).toMatchObject({
      fiveElementSchemeKey: "Shui",
      fiveElementSchemeName: FIVE_ELEMENT_SCHEME.Shui,
      fiveElementSchemeValue: 2,
    });
  });

  it("wraps indexes to cover跨越午未场景", () => {
    const scheme = calculateFiveElementScheme("Ding", "You");

    expect(scheme).toMatchObject({
      fiveElementSchemeKey: "Tu",
      fiveElementSchemeValue: 5,
    });
  });
});
