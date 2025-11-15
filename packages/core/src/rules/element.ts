import {
  BRANCH_KEYS,
  FIVE_ELEMENT_KEYS,
  FIVE_ELEMENT_SCHEME,
  FIVE_ELEMENT_SCHEME_VALUE,
  STEM_KEYS,
} from "../constants";
import type { BranchKey, StemKey } from "../typings";
import { wrapIndex } from "../utils/math";

export function calculateFiveElementScheme(stemKey: StemKey, branchKey: BranchKey) {
  // 获取天干和地支的索引
  const stemIndex = STEM_KEYS.indexOf(stemKey);
  const branchIndex = BRANCH_KEYS.indexOf(branchKey);

  // 计算天干和地支对应的五行局编号
  const stemNumber = Math.floor(stemIndex / 2) + 1;
  const branchNumber = Math.floor(wrapIndex(branchIndex, 6) / 2) + 1;

  // 计算五行局的信息
  const fiveElementSchemeIndex = (stemNumber + branchNumber - 1) % 5;
  const fiveElementSchemeKey = FIVE_ELEMENT_KEYS[fiveElementSchemeIndex];
  const fiveElementSchemeName = FIVE_ELEMENT_SCHEME[fiveElementSchemeKey];
  const fiveElementSchemeValue = FIVE_ELEMENT_SCHEME_VALUE[fiveElementSchemeKey];

  return {
    fiveElementSchemeKey,
    fiveElementSchemeIndex,
    fiveElementSchemeName,
    fiveElementSchemeValue,
  };
}
