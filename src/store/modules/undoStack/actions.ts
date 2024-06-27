import {
  POP_OPERATION_UNDOSTACK,
  PUSH_OPERATION_UNDOSTACK,
  SHIFT_OPERATION_UNDOSTACK,
} from "./constants";
import type { ElementObj } from "./types";

// 添加记录
export function pushOperationUndoStack(payload: ElementObj) {
  return {
    type: PUSH_OPERATION_UNDOSTACK,
    payload,
  };
}

// 删除记录
export function shiftOperationUndoStack() {
  return {
    type: SHIFT_OPERATION_UNDOSTACK,
    payload: null,
  };
}

// 弹出记录
export function popOperationUndoStack() {
  return {
    type: POP_OPERATION_UNDOSTACK,
    payload: null,
  };
}
