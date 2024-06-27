import {
  POP_OPERATION_REDOSTACK,
  PUSH_OPERATION_REDOSTACK,
  SHIFT_OPERATION_REDOSTACK,
} from "./constants";
import type { ElementObj } from "./types";

// 添加记录
export function pushOperationRedoStack(payload: ElementObj) {
  return {
    type: PUSH_OPERATION_REDOSTACK,
    payload,
  };
}

// 删除记录
export function shiftOperationRedoStack() {
  return {
    type: SHIFT_OPERATION_REDOSTACK,
    payload: null,
  };
}

// 弹出记录
export function popOperationRedoStack() {
  return {
    type: POP_OPERATION_REDOSTACK,
    payload: null,
  };
}
