import { UPDATE_ACTIVE } from "@/store/constants/active";
import { Action } from "@/types/reduxType";

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
