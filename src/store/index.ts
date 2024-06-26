import { combineReducers, legacy_createStore as createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import canvasReducer from "./modules/canvas/reducer"
import elementReducer from "./modules/element/reducer"
import activeReducer from "./modules/active/reducer"

const store = createStore(combineReducers({
  canvas: canvasReducer,
  element: elementReducer,
  active: activeReducer,
}), composeWithDevTools());

export default store;
