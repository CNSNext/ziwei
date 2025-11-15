export interface GlobalConfigs {
  /**
   * 年分界点参数，默认为正月初一分界。
   *
   * - normal：正月初一分界
   * - spring：立春分界
   */
  _yearDivision: "normal" | "spring";

  /**
   * 月分界点参数，默认为月中分界。
   *
   * - normal：正月中分界
   * - last：视为上月
   * - next：视为下月
   */
  _monthDivision: "normal" | "last" | "next";

  /**
   * 日分界点参数，默认为子时为次日。
   *
   * - normal：子时为次日
   * - current：当前子时为当日
   */
  _dayDivision: "normal" | "current";
}

const DEFAULT_GLOBAL_CONFIGS: GlobalConfigs = {
  _yearDivision: "normal",
  _monthDivision: "normal",
  _dayDivision: "normal",
};

export function getGlobalConfigs(): GlobalConfigs {
  return { ...DEFAULT_GLOBAL_CONFIGS };
}
