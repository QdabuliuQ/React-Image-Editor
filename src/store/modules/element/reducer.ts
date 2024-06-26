import {
  ADD_ELEMENT,
  DELETE_ELEMENT_BY_IDX,
  INIT_ELEMENT,
  UPDATE_ELEMENT_BY_IDX,
} from "./constant";
import { Element } from "@/types/element";
import { Action } from "@/types/reduxType";

const initialValue: Array<Element> = [];

const elementReducer = (state = initialValue, action: Action<Element>) => {
  const { type, payload } = action;

  if (type === INIT_ELEMENT) {
    return payload;
  } else if (type === UPDATE_ELEMENT_BY_IDX) {
    const { idx, data } = payload;
    state[idx] = data;
    return [...state];
  } else if (type === ADD_ELEMENT) {
    return [...state, payload];
  } else if (type === DELETE_ELEMENT_BY_IDX) {
    for (let i = 0; i < state.length; i++) {
      if ((state[i] as any)._data.id === payload) {
        state.splice(i as unknown as number, 1);
        return [...state];
      }
    }
    return state;
  } else {
    return state;
  }
};

export default elementReducer;
