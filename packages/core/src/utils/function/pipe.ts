// biome-ignore-all lint/suspicious/noExplicitAny: false positive
export function pipe<R>(f: () => R): () => R;
export function pipe<A extends any[], R>(f1: (...args: A) => R): (...args: A) => R;
export function pipe<A extends any[], R1, R2>(
  f1: (...args: A) => R1,
  f2: (a: R1) => R2,
): (...args: A) => R2;
export function pipe<A extends any[], R1, R2, R3>(
  f1: (...args: A) => R1,
  f2: (a: R1) => R2,
  f3: (a: R2) => R3,
): (...args: A) => R3;
export function pipe<A extends any[], R1, R2, R3, R4>(
  f1: (...args: A) => R1,
  f2: (a: R1) => R2,
  f3: (a: R2) => R3,
  f4: (a: R3) => R4,
): (...args: A) => R4;
export function pipe<A extends any[], R1, R2, R3, R4, R5>(
  f1: (...args: A) => R1,
  f2: (a: R1) => R2,
  f3: (a: R2) => R3,
  f4: (a: R3) => R4,
  f5: (a: R4) => R5,
): (...args: A) => R5;
export function pipe(...funcs: Array<(...args: any[]) => any>): (...args: any[]) => any;
export function pipe(...funcs: Array<(...args: any[]) => any>): (...args: any[]) => any {
  return function (this: any, ...args: any[]) {
    let result = funcs.length ? funcs[0].apply(this, args) : args[0];
    for (let i = 1; i < funcs.length; i++) {
      result = funcs[i].call(this, result);
    }
    return result;
  };
}
