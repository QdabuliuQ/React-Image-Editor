import { INIT_CANVAS } from "@/store/constants/canvas";
import { Canvas } from "@/types/canvas";
import { Action } from "@/types/reduxType";

const initialValue: Canvas = {
  width: 500,
  height: 700,
};

const canvasReducer = (state = initialValue, action: Action<Canvas>) => {
  const { type, payload } = action;

  if (type === INIT_CANVAS) {
    return payload;
  } else {
    return state;
  }
};

export default canvasReducer;
