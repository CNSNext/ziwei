import { BRANCH_KEYS, HOUR_RANGES, STEM_KEYS, YIN_YANG, YIN_YANG_KEYS } from "../constants";
import type { ZiWeiRuntime } from "../context";
import { createNatal } from "../models/natal";
import { calculateFiveElementScheme } from "../rules/element";
import { calculateMainPalaceIndex, calculatePalaceStemsAndBranches } from "../rules/palace";
import { calculateStarIndex } from "../rules/star";
import type { NatalCalculateParams } from "../typings";
import { calculateDecadeByDate } from "./decade";
import { calculatePalaces } from "./palace";

export function calculateNatal(
  ctx: ZiWeiRuntime,
  {
    name = "匿名",
    gender,
    monthIndex,
    day,
    hourIndex,
    birthYear,
    birthYearStemKey,
    birthYearBranchKey,
    solarDate,
    solarDateByTrue,
    lunisolarDate,
    sexagenaryCycleDate,
  }: NatalCalculateParams,
  referenceDate?: Date,
) {
  const palaceStemsAndBranches = calculatePalaceStemsAndBranches(birthYearStemKey);
  const mainPalaceIndex = calculateMainPalaceIndex(monthIndex, hourIndex);
  const { stemKey: mainPalaceStemKey, branchKey: mainPalaceBranchKey } =
    palaceStemsAndBranches[mainPalaceIndex];

  const { fiveElementSchemeName, fiveElementSchemeValue } = calculateFiveElementScheme(
    mainPalaceStemKey,
    mainPalaceBranchKey,
  );

  const { ziweiIndex, tianfuIndex } = calculateStarIndex(day, fiveElementSchemeValue);

  const stemAttr = (STEM_KEYS.indexOf(birthYearStemKey) + 1) % 2;
  const decadeDirection = YIN_YANG[gender] === stemAttr ? 1 : -1;

  const palaces = calculatePalaces(ctx, {
    stemBranches: palaceStemsAndBranches,
    birthYearStemKey,
    mainPalaceIndex,
    ziweiIndex,
    tianfuIndex,
    monthIndex,
    hourIndex,
    decadeDirection,
    fiveElementSchemeValue,
  });

  const decade = calculateDecadeByDate(ctx, {
    palaces,
    birthYearBranchKey,
    birthYear,
    date: referenceDate ?? ctx.now(),
  });

  const natal = createNatal(ctx, {
    name,
    gender: ctx.i18n.$t(`one.${YIN_YANG_KEYS[stemAttr]}`) + ctx.i18n.$t(`gender.${gender}`),
    birthYearStem: ctx.i18n.$t(`stem.${birthYearStemKey}`),
    birthYearStemKey,
    birthYearBranch: ctx.i18n.$t(`branch.${birthYearBranchKey}`),
    birthYearBranchKey,
    ziweiBranch: palaces[ziweiIndex].branch.name,
    ziweiBranchKey: palaces[ziweiIndex].branch.key,
    mainPalaceBranch: ctx.i18n.$t(`branch.${mainPalaceBranchKey}`),
    mainPalaceBranchKey: mainPalaceBranchKey,
    solarDate,
    solarDateByTrue,
    lunisolarYear: birthYear,
    lunisolarDate,
    sexagenaryCycleDate,
    hour: `${ctx.i18n.$t(`branch.${BRANCH_KEYS[hourIndex]}`)}${ctx.i18n.$t("hour")}`,
    hourRange: HOUR_RANGES[hourIndex],
    zodiac: ctx.i18n.$t(`zodiac.${birthYearBranchKey}`),
    fiveElementSchemeValue,
    fiveElementSchemeName,
    palaces,
    decade,
    decadeDirection,
  });

  return natal;
}
