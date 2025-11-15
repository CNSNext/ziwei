import { describe, expect, it } from "vitest";
import { freeze, keys, mapKeys, mapValues, values } from "../object";

describe("utils/object", () => {
  it("freeze() 会阻止对象后续被修改", () => {
    const payload = freeze({ foo: 1 });
    expect(() => {
      (payload as { foo: number }).foo = 2;
    }).toThrow(TypeError);
  });

  it("keys()/values() 会保持插入顺序", () => {
    const obj = { a: 1, b: 2 };
    expect(keys(obj)).toEqual(["a", "b"]);
    expect(values(obj)).toEqual([1, 2]);
  });

  it("mapKeys() 可重命名对象键", () => {
    const obj = { alpha: 1, beta: 2 };
    const mapped = mapKeys(obj, (_, key) => key.toUpperCase());
    expect(mapped).toEqual({ ALPHA: 1, BETA: 2 });
  });

  it("mapValues() 可转换对象的值", () => {
    const obj = { alpha: 1, beta: 2 };
    const mapped = mapValues(obj, (value, key) => `${key}:${value * 2}`);
    expect(mapped).toEqual({ alpha: "alpha:2", beta: "beta:4" });
  });
});
