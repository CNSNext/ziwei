import { STEM_TRANSFORMATIONS } from "../constants";
import type { Palace, PalaceProps } from "../typings";

export function createPalace(props: PalaceProps): Palace {
  return {
    ...props,
    flying() {
      return STEM_TRANSFORMATIONS[props.stem.key];
    },
  };
}
