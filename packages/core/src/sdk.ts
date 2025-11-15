import {
  createZiWeiRuntime,
  defaultRuntime,
  type ZiWeiRuntime,
  type ZiWeiRuntimeInvokeOptions,
  type ZiWeiRuntimeOptions,
} from "./context";
import { calculateNatalByLunisolar, calculateNatalBySolar } from "./pipelines/natal";
import type { CreateZiWeiLunisolarParams, CreateZiWeiSolarParams } from "./typings";

export {
  createZiWeiRuntime,
  type ZiWeiRuntime,
  type ZiWeiRuntimeInvokeOptions,
  type ZiWeiRuntimeOptions,
};

export function createZiWeiBySolar(
  params: CreateZiWeiSolarParams,
  options?: ZiWeiRuntimeInvokeOptions,
) {
  return calculateNatalBySolar(defaultRuntime, params, options);
}

export function createZiWeiByLunisolar(
  params: CreateZiWeiLunisolarParams,
  options?: ZiWeiRuntimeInvokeOptions,
) {
  return calculateNatalByLunisolar(defaultRuntime, params, options);
}
