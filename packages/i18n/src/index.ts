/** 语言资源映射：键为语言标识，值为任意层级的字典。 */
type ResourceMap = Record<string, Record<string, unknown>>;

/** 默认的缺省文案。 */
const DEFAULT_FALLBACK_TEXT = "Missing translation";

/** 默认的键分隔符。 */
const DEFAULT_SEPARATOR = ".";

/** 将值归一化为数组，便于统一处理单个或多个输入。 */
const toArray = <T>(value?: T | readonly T[]): readonly T[] => {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? (value as readonly T[]) : ([value] as readonly T[]);
};

/** 过滤并去重回退语言数组，保证所有语言合法可用。 */
const sanitizeFallbacks = <Lang extends string>(
  value: Lang | readonly Lang[] | undefined,
  available: readonly Lang[],
): Lang[] => {
  const unique = new Set<Lang>();

  for (const candidate of toArray(value)) {
    if (available.includes(candidate) && !unique.has(candidate)) {
      unique.add(candidate);
    }
  }

  return Array.from(unique);
};

/** 判断某个值是否为可遍历的对象。 */
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/** 根据层级键数组递归取值，若最终拿到字符串则返回。 */
const resolveSegments = (
  resource: DeepReadonly<Record<string, unknown>>,
  segments: readonly string[],
): string | undefined => {
  let value: unknown = resource;

  for (const segment of segments) {
    if (!isRecord(value) || !(segment in value)) {
      return undefined;
    }
    value = (value as Record<string, unknown>)[segment];
  }

  return typeof value === "string" ? value : undefined;
};

/** 构建最终的语言尝试顺序：当前语言优先，再按回退链依次尝试。 */
const buildSearchOrder = <Lang extends string>(
  primary: Lang,
  fallbacks: readonly Lang[],
): Lang[] => {
  const result = [primary];
  for (const lang of fallbacks) {
    if (lang !== primary) {
      result.push(lang);
    }
  }
  return result;
};

/** 计算资源对象的所有嵌套键。 */
export type NestedKeyOf<T, Depth extends number = 5> = [Depth] extends [never]
  ? never
  : T extends Record<string, unknown>
    ? {
        [K in Extract<keyof T, string>]: T[K] extends Record<string, unknown>
          ? `${K}.${NestedKeyOf<T[K], Prev[Depth]>}` | K
          : K;
      }[Extract<keyof T, string>]
    : never;

/** 递归深度控制数组。 */
export type Prev = [never, 0, 1, 2, 3, 4, 5];

/** 深度只读类型，禁止资源对象在运行期被修改。 */
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Record<string, unknown> ? DeepReadonly<T[K]> : T[K];
};

export type LanguageKey<TResourcesMap extends ResourceMap> = keyof TResourcesMap & string;
export type I18nLanguages<TResourcesMap extends ResourceMap> = LanguageKey<TResourcesMap>;
export type TranslationKey<TResourcesMap extends ResourceMap> = NestedKeyOf<
  TResourcesMap[LanguageKey<TResourcesMap>]
>;

export interface MissingTranslationInfo<Lang extends string> {
  key: string;
  languagesTried: Lang[];
}

export interface I18nCreateOptions<TResourcesMap extends ResourceMap> {
  /** 默认语言。 */
  lang: LanguageKey<TResourcesMap>;
  /** 语言资源。 */
  resources: TResourcesMap;
  /** 默认缺失文案。 */
  fallback?: string;
  /** 回退语言链。 */
  fallbackLanguages?: LanguageKey<TResourcesMap> | readonly LanguageKey<TResourcesMap>[];
  /** 键分隔符，默认为 "."。 */
  separator?: string;
  /** 缺失文案时的回调。 */
  onMissing?: (info: MissingTranslationInfo<LanguageKey<TResourcesMap>>) => void;
}

export interface I18n<TResourcesMap extends ResourceMap> {
  /**
   * 获取翻译文本。
   *
   * @param key - 翻译键，支持嵌套路径。
   * @param defaultValue - 可选的兜底文本，优先级高于全局 fallback。
   */
  $t(key: TranslationKey<TResourcesMap>, defaultValue?: string): string;
  /**
   * 判断某个键在当前或指定语言中是否存在。
   *
   * @param key - 待检查的翻译键。
   * @param lang - 可选指定语言，不传则按回退链查找。
   */
  has(key: TranslationKey<TResourcesMap>, lang?: LanguageKey<TResourcesMap>): boolean;
  /** 获取当前语言。 */
  getCurrentLanguage(): LanguageKey<TResourcesMap>;
  /**
   * 设置当前语言。
   *
   * @param lang - 目标语言，必须存在于 resources 中。
   */
  setCurrentLanguage(lang: LanguageKey<TResourcesMap>): void;
  /** 列出可用语言。 */
  getAvailableLanguages(): readonly LanguageKey<TResourcesMap>[];
  /** 读取回退语言链。 */
  getFallbackLanguages(): readonly LanguageKey<TResourcesMap>[];
  /**
   * 设置回退语言链。
   *
   * @param langs - 单个或多个语言，非法项会被过滤。
   */
  setFallbackLanguages(
    langs: LanguageKey<TResourcesMap> | readonly LanguageKey<TResourcesMap>[],
  ): void;
  /**
   * 注册语言变更监听器。
   *
   * @param fn - 在语言变化时触发的回调。
   * @returns 取消订阅函数。
   */
  onLanguageChange(fn: (lang: LanguageKey<TResourcesMap>) => void): () => void;
}

/**
 * 创建一个轻量级的 i18n 实例。
 *
 * @param options - 初始化参数，包括默认语言、资源、分隔符等。
 * @returns I18n 实例，提供翻译与监听能力。
 */
export function createI18n<const TResourcesMap extends ResourceMap>({
  lang,
  resources,
  fallback,
  fallbackLanguages,
  separator = DEFAULT_SEPARATOR,
  onMissing,
}: I18nCreateOptions<TResourcesMap>): I18n<TResourcesMap> {
  const normalizedResources = resources as DeepReadonly<TResourcesMap>;
  type Lang = LanguageKey<TResourcesMap>;

  if (!(lang in normalizedResources)) {
    throw new Error(`Language "${lang}" is not provided in resources`);
  }

  const availableLanguages = Object.freeze(
    Object.keys(normalizedResources) as Lang[],
  ) as readonly Lang[];

  let fallbackChain = sanitizeFallbacks(fallbackLanguages as Lang | Lang[] | undefined, [
    ...availableLanguages,
  ]);

  const listeners = new Set<(lang: Lang) => void>();
  let currentLanguage = lang as Lang;

  /** 根据自定义分隔符拆分键，若无法拆出多段则回退到默认分隔符。 */
  const splitKey = (key: string): string[] => {
    const primarySegments = key.split(separator).filter(Boolean);
    if (primarySegments.length > 1 || separator === DEFAULT_SEPARATOR) {
      return primarySegments;
    }
    if (key.includes(DEFAULT_SEPARATOR)) {
      return key.split(DEFAULT_SEPARATOR).filter(Boolean);
    }
    return primarySegments;
  };

  /** 确认语言是否存在，避免传入非法语言。 */
  const ensureLanguageExists = (language: Lang): Lang => {
    if (!(language in normalizedResources)) {
      throw new Error(`Language "${language}" is not provided in resources`);
    }
    return language;
  };

  /** 在指定语言中查找翻译。 */
  const translateFromLanguage = (language: Lang, key: string): string | undefined => {
    const resource = normalizedResources[language];
    if (!resource) {
      return undefined;
    }
    const segments = splitKey(key);
    return segments.length === 0 ? undefined : resolveSegments(resource, segments);
  };

  /** 按顺序依次尝试多种语言，直到找到翻译或全部失败。 */
  const translate = (key: string, order: Lang[]): string | undefined => {
    for (const language of order) {
      const value = translateFromLanguage(language, key);
      if (value !== undefined) {
        return value;
      }
    }
    return undefined;
  };

  /** 派发语言变更事件。 */
  const emitLanguageChange = (nextLanguage: Lang): void => {
    listeners.forEach((fn) => {
      fn(nextLanguage);
    });
  };

  return {
    $t(key, defaultValue) {
      const fallbackText = defaultValue ?? fallback ?? DEFAULT_FALLBACK_TEXT;
      const searchOrder = buildSearchOrder(currentLanguage, fallbackChain);
      const result = translate(key, searchOrder);

      if (result !== undefined) {
        return result;
      }

      onMissing?.({
        key,
        languagesTried: searchOrder,
      });
      return fallbackText;
    },
    has(key, lang?: Lang) {
      const searchOrder = lang
        ? [ensureLanguageExists(lang)]
        : buildSearchOrder(currentLanguage, fallbackChain);
      return translate(key, searchOrder) !== undefined;
    },
    getCurrentLanguage() {
      return currentLanguage;
    },
    setCurrentLanguage(language) {
      const nextLanguage = ensureLanguageExists(language);
      if (nextLanguage === currentLanguage) {
        return;
      }
      currentLanguage = nextLanguage;
      emitLanguageChange(nextLanguage);
    },
    getAvailableLanguages() {
      return availableLanguages;
    },
    getFallbackLanguages() {
      return [...fallbackChain];
    },
    setFallbackLanguages(langs) {
      fallbackChain = sanitizeFallbacks(langs as Lang | readonly Lang[] | undefined, [
        ...availableLanguages,
      ]);
    },
    onLanguageChange(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
  };
}
