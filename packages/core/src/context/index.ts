import { type GlobalConfigs, getGlobalConfigs } from "../infra/configs";
import { createZiWeiI18n } from "../infra/i18n";
import type { NatalCalculateOptions } from "../typings";

export interface ZiWeiRuntimeInvokeOptions extends NatalCalculateOptions {}

export interface ZiWeiRuntimeOptions {
  i18n?: ReturnType<typeof createZiWeiI18n>;
  configs?: GlobalConfigs;
  now?: () => Date;
}

export function createZiWeiRuntime(options: ZiWeiRuntimeOptions = {}) {
  return {
    i18n: options.i18n ?? createZiWeiI18n(),
    configs: options.configs ?? getGlobalConfigs(),
    now: options.now ?? (() => new Date()),
  };
}

export type ZiWeiRuntime = ReturnType<typeof createZiWeiRuntime>;

export const defaultRuntime: ZiWeiRuntime = createZiWeiRuntime();
