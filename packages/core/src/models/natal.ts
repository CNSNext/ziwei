import type { ZiWeiRuntime } from "../context";
import { calculateDecade } from "../services/decade";
import type { Natal, NatalProps } from "../typings";

export function createNatal(ctx: ZiWeiRuntime, props: NatalProps): Natal {
  return {
    ...props,
    getDecade(index) {
      return calculateDecade(ctx, {
        palaces: props.palaces,
        index,
        birthYearBranchKey: props.birthYearBranchKey,
        birthYear: props.lunisolarYear,
      });
    },
    getDecadeIndex() {
      return props.decade.findIndex((item) => item.key === "Ming");
    },
  };
}
