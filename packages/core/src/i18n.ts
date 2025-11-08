import { createI18n } from "@ziweijs/i18n";
import ZH_CN from "./locales/zh-CN";
import ZH_HANT from "./locales/zh-Hant";

const i18n = createI18n({
  lang: "zh-CN",
  resources: {
    "zh-CN": ZH_CN,
    "zh-Hant": ZH_HANT,
  },
});

export default i18n;
