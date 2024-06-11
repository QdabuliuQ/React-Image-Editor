import { UPDATE_ACTIVE } from "../constants/active";

// 更新 active 值
export function updateActive(payload: string) {
  return {
    type: UPDATE_ACTIVE,
    payload,
  };
}
