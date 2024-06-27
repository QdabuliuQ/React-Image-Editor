import { UPDATE_ACTIVE } from "./constant";
import type { Action } from "@/types/reduxType";

const initialValue: string = "";

const activeReducer = (state = initialValue, action: Action<string>) => {
  const { type, payload } = action;
  if (type === UPDATE_ACTIVE) {
    return payload;
  } else {
    return state;
  }
};

export default activeReducer;
