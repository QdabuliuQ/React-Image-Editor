import { combineReducers } from "redux";

import activeReducer from "./active";
import canvasReducer from "./canvas";
import elementReducer from "./element";

const rootReducer = combineReducers({
  canvas: canvasReducer,
  element: elementReducer,
  active: activeReducer,
});

export default rootReducer;
