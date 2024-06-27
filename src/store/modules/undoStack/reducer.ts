import type { Action } from "@/types/reduxType";

import {
  CLEAR_OPERATION_UNDOSTACK,
  POP_OPERATION_UNDOSTACK,
  PUSH_OPERATION_UNDOSTACK,
  SHIFT_OPERATION_UNDOSTACK,
} from "./constants";
import type { ElementObj } from "./types";

const initialValue: Array<ElementObj> = [];

const undoStackReducer = (
  state = initialValue,
  action: Action<ElementObj | null>
) => {
  const { type, payload } = action;
  if (type === PUSH_OPERATION_UNDOSTACK) {
    state.push(payload as ElementObj);
    return [...state];
  } else if (type === SHIFT_OPERATION_UNDOSTACK) {
    state.shift();
    return [...state];
  } else if (type === POP_OPERATION_UNDOSTACK) {
    state.pop();
    return [...state];
  } else if (type === CLEAR_OPERATION_UNDOSTACK) {
    return []
  }
  return state;
};

export default undoStackReducer;
