import { UPDATE_ACTIVE } from "./constant";

// 更新 active 值
export function updateActive(payload: string) {
  return {
    type: UPDATE_ACTIVE,
    payload,
  };
}
