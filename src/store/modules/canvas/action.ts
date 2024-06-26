import { UPDATE_CANVAS } from "./constant";

// 更新画布
export function updateCanvas(payload: { key: string; value: any }) {
  return {
    type: UPDATE_CANVAS,
    payload,
  };
}
