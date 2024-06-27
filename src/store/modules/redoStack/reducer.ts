import type { Action } from "@/types/reduxType";

import {
  POP_OPERATION_REDOSTACK,
  PUSH_OPERATION_REDOSTACK,
  SHIFT_OPERATION_REDOSTACK,
} from "./constants";
import type { ElementObj } from "./types";

const initialValue: Array<ElementObj> = [];

const redoStackReducer = (
  state = initialValue,
  action: Action<ElementObj | null>
) => {
  const { type, payload } = action;
  if (type === PUSH_OPERATION_REDOSTACK) {
    state.push(payload as ElementObj);
    return [...state];
  } else if (type === SHIFT_OPERATION_REDOSTACK) {
    state.shift();
    return [...state];
  } else if (type === POP_OPERATION_REDOSTACK) {
    state.pop();
    return [...state];
  }
  return state;
};

export default redoStackReducer;
