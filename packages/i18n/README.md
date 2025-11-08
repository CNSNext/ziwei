# @ziweijs/i18n

类型安全、零依赖的国际化工具，提供轻量的 `createI18n` 工厂方法，适用于 `@ziweijs/core` 以及其他需要简单字典查找的场景。直接传入资源对象即可自动推导语言键和值类型，无需手动声明泛型。

## 特性
- 自动推导语言与嵌套键，无需手动传入泛型；
- 自定义 `fallback` 文案与回退语言链，缺失时自动搜索其它语言；
- `has()`、`getAvailableLanguages()` 等方法帮助在渲染前校验 key；
- 内置语言变更监听器，并返回取消订阅函数；
- `onMissing` 钩子可记录缺失文案日志；
- 通过 `I18nLanguages<typeof resources>` 快速获取支持的语言联合类型；
- 自定义分隔符、严格的运行时校验，保证调用端体验一致。

## 安装

```bash
pnpm add @ziweijs/i18n
```

## 使用示例

```ts
import { createI18n, type I18n, type I18nLanguages, type TranslationKey } from "@ziweijs/i18n";

const resources = {
  "zh-CN": {
    greeting: { welcome: "欢迎" },
    farewell: "再见",
  },
  "zh-Hant": {
    greeting: { welcome: "歡迎" },
    farewell: "再見",
    legacy: "只有繁體有的文案",
  },
} as const;

const i18n = createI18n({
  lang: "zh-CN",
  resources,
  fallback: "N/A",
  fallbackLanguages: "zh-Hant",
  onMissing({ key, languagesTried }) {
    console.warn(`[i18n] missing key "${key}"`, languagesTried);
  },
});

i18n.$t("greeting.welcome"); // => 欢迎
i18n.$t("legacy"); // => 只有繁體有的文案（来自 zh-Hant）
i18n.has("legacy", "zh-CN"); // => false

const dispose = i18n.onLanguageChange(console.log);
i18n.setCurrentLanguage("zh-Hant");
dispose();

type SupportedLang = I18nLanguages<typeof resources>;
// SupportedLang === "zh-CN" | "zh-Hant"

type TranslationKeys = TranslationKey<typeof resources>;
// TranslationKeys === "greeting.welcome" | "farewell" | "legacy"
```

## 配置项
- `lang`: 默认语言，必须是资源对象的 key。
- `resources`: 多语言资源对象（推荐 `as const` 以便推导类型）。
- `fallback`: 缺失文案时的默认文本，可被 `$t(key, override)` 覆盖。
- `fallbackLanguages`: 单个或多个候选语言，按顺序作为兜底；重复或非法语言会被过滤。
- `separator`: 自定义分隔符，默认 `"."`，可设置为 `"/"` 等以匹配 RESTful 路径。
- `onMissing`: 文案缺失时触发的回调，参数包含缺失 `key` 与已尝试的语言顺序，便于监控。

## 实例方法
- `$t(key, defaultText?)`: 读取翻译，支持嵌套 key；若缺失则按 `defaultText → fallback → fallbackLanguages` 顺序回退。
- `has(key, lang?)`: 判断当前语言或指定语言是否存在某个 key。
- `setCurrentLanguage(lang) / getCurrentLanguage()`: 切换或读取当前语言，非法语言会抛错。
- `setFallbackLanguages(langs) / getFallbackLanguages()`: 动态调整兜底链，内部返回快照，外部修改不会污染内部状态。
- `getAvailableLanguages()`: 返回所有可用语言列表（只读）。
- `onLanguageChange(listener)`: 监听语言切换，返回取消订阅函数，便于在组件卸载时清理。

## 常见模式
- **类型透传**：结合 `I18nLanguages`、`TranslationKey`、`NestedKeyOf`、`DeepReadonly` 等类型，可为组件 props 或自定义 hooks 提供严格类型约束。
- **UI 集成**：在 React/Vue 状态管理中缓存 `i18n` 实例，使用 `onLanguageChange` 触发重渲染；也可搭配 Zustand/Redux/Vuex。
- **缺失监控**：在 `onMissing` 中上报埋点，记录缺失 key 与语言顺序，方便翻译团队补齐。
- **懒加载语言**：异步加载语言文件后，重新创建 `i18n` 或调用 `setFallbackLanguages`，即可实现按需加载。
- **SSR/同构**：在服务端根据请求语言构造实例，并把 `lang` 与资源快照注入到前端，保证 `getCurrentLanguage()` 一致。
