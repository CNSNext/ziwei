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
    getDecadeIndex(decade) {
      if (decade) {
        return decade.findIndex((item) => item.key === "Ming");
      }
      return props.decade[props.decadeIndex].findIndex((item) => item.key === "Ming");
    },
  };
}
