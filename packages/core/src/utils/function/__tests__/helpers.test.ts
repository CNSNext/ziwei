import { describe, expect, it, vi } from "vitest";
import { type MemoizeCache, memoize } from "../memoize";
import { pipe } from "../pipe";

describe("utils/function helpers", () => {
  it("memoize 支持自定义缓存 key", () => {
    const spy = vi.fn(({ value }: { value: number }) => value * 2);
    const memoized = memoize(spy, {
      getCacheKey: ({ value }) => value,
    });

    expect(memoized({ value: 2 })).toBe(4);
    expect(memoized({ value: 2 })).toBe(4);
    expect(memoized.cache.size).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("memoize 可复用外部缓存实现", () => {
    class FakeCache<K, V> implements MemoizeCache<K, V> {
      #map = new Map<K, V>();
      set(key: K, value: V) {
        this.#map.set(key, value);
      }
      get(key: K) {
        return this.#map.get(key);
      }
      has(key: K) {
        return this.#map.has(key);
      }
      delete(key: K) {
        return this.#map.delete(key);
      }
      clear() {
        this.#map.clear();
      }
      get size() {
        return this.#map.size;
      }
    }

    const cache = new FakeCache<number, number>();
    const spy = vi.fn((value: number) => value * 3);
    const memoized = memoize(spy, { cache });

    expect(memoized(2)).toBe(6);
    expect(memoized(2)).toBe(6);
    expect(cache.size).toBe(1);
    expect(memoized.cache).toBe(cache);
  });

  it("memoize 默认将入参作为缓存键", () => {
    const spy = vi.fn((value: number) => value * 5);
    const memoized = memoize(spy);
    expect(memoized(3)).toBe(15);
    expect(memoized(3)).toBe(15);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("pipe 可串联多个函数并传递参数", () => {
    const pipeline = pipe(
      (a: number, b: number) => a + b,
      (sum) => sum * 2,
      (product) => `value:${product}`,
    );

    expect(pipeline(2, 3)).toBe("value:10");
  });

  it("pipe 无函数时返回首个参数", () => {
    const passthrough = pipe();
    expect(passthrough("foo", "bar")).toBe("foo");
  });

  it("pipe 会保留首个函数的 this 上下文", () => {
    const pipeline = pipe(
      function (this: { base: number }, value: number) {
        return this.base + value;
      },
      (sum) => sum * 3,
    );

    const receiver = { base: 2, run: pipeline };
    expect(receiver.run(4)).toBe(18);
  });
});
