import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { modelViewerReducer } from "../features/ModelViewer";

const rootReducer = combineReducers({
  modelViewerState: modelViewerReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
