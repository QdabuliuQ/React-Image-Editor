import { combineReducers, legacy_createStore as createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import activeReducer from "./modules/active/reducer";
import canvasReducer from "./modules/canvas/reducer";
import elementReducer from "./modules/element/reducer";
import instanceReducer from "./modules/instance/reducer";
import redoStackReducer from "./modules/redoStack/reducer";
import undoStackReducer from "./modules/undoStack/reducer";

const store = createStore(
  combineReducers({
    canvas: canvasReducer,
    element: elementReducer,
    active: activeReducer,
    redoStack: redoStackReducer,
    undoStack: undoStackReducer,
    instance: instanceReducer,
  }),
  composeWithDevTools()
);

export default store;
