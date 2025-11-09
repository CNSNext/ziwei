import { LunarHour } from "tyme4ts";
import { getGlobalConfigs } from "./configs";
import { calculateAstrolabe } from "./core/engine";
import i18n from "./i18n";
import {
  calculateAstrolabeDate,
  calculateAstrolabeDateBySolar,
  calculateHourByIndex,
  calculateLunisolarDateBySolar,
  calculateTrueSolarTime,
  getLunisolarDateText,
  getSolarDateText,
} from "./tools/date";
import type { GenderKey, Language } from "./typings";

export interface SolarParams {
  /** 姓名 */
  name: string;
  /** 性别 Key */
  gender: GenderKey;
  /** 出生日期 */
  date: Date;
  /** 语言 */
  language?: Language;
  /** 出生地经度 默认为116.38333 北京天安门 */
  longitude?: number;
  /** 出生时区 默认为 8，北京时区 */
  timezoneOffset?: number;
  /** 是否采用真太阳时计算 默认为 true */
  useTrueSolarTime?: boolean;
}

/**
 * 通过阳历获取紫微斗数命盘信息
 */
export function bySolar(params: SolarParams) {
  const {
    name,
    gender,
    date,
    language,
    longitude = 116.38333,
    useTrueSolarTime,
    timezoneOffset = 8,
  } = params;

  language && i18n.setCurrentLanguage(language);

  const globalConfigs = getGlobalConfigs();
  let currentSolarDate: Date = date;
  // 若有出生经度，计算真太阳时
  if (longitude) {
    // 计算真太阳时
    const trueSolarTime = calculateTrueSolarTime(date, longitude, timezoneOffset);
    if (useTrueSolarTime) {
      currentSolarDate = trueSolarTime;
    }
  }
  const lunarHour = calculateLunisolarDateBySolar(currentSolarDate);
  // 转阴历 - 通过阴历计算排盘数据：出生年干、年支、月数、日数、时数索引
  const { stemKey, branchKey, monthIndex, day, hourIndex } = calculateAstrolabeDateBySolar({
    date: lunarHour,
    globalConfigs,
  });

  return calculateAstrolabe({
    name,
    gender,
    monthIndex,
    day,
    hourIndex,
    birthYear: lunarHour.getYear(),
    birthYearStemKey: stemKey,
    birthYearBranchKey: branchKey,
    solarDate: getSolarDateText(date),
    solarDateByTrue: getSolarDateText(currentSolarDate),
    lunisolarDate: getLunisolarDateText(lunarHour, hourIndex),
    sexagenaryCycleDate: lunarHour.getEightChar().toString(),
  });
}

export interface LunisolarParams {
  /** 姓名 */
  name: string;
  /** 性别 Key */
  gender: GenderKey;
  /** 出生日期 YYYY-m-d-hourIndex  */
  date: string;
  /** 语言 */
  language?: Language;
}

/**
 * 通过农历获取紫微斗数命盘信息
 */
export function byLunisolar({ name, gender, date, language }: LunisolarParams) {
  language && i18n.setCurrentLanguage(language);
  const [year, month, days, currentHourIndex] = date.split("-").map(Number);
  const [hour, minute, second] = calculateHourByIndex(currentHourIndex);
  const lunarHour = LunarHour.fromYmdHms(year, month, days, hour, minute, second);
  const solarTime = lunarHour.getSolarTime();
  const { stemKey, branchKey, monthIndex, day, hourIndex } = calculateAstrolabeDate(date);

  return calculateAstrolabe({
    name,
    gender,
    monthIndex,
    day,
    hourIndex,
    birthYear: lunarHour.getYear(),
    birthYearStemKey: stemKey,
    birthYearBranchKey: branchKey,
    solarDate: getSolarDateText(solarTime),
    solarDateByTrue: undefined,
    lunisolarDate: getLunisolarDateText(lunarHour, hourIndex),
    sexagenaryCycleDate: lunarHour.getEightChar().toString(),
  });
}
