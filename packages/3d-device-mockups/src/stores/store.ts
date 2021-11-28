import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { materialSettingReducer } from "../features/MaterialSetting";
import { modelViewerReducer } from "../features/ModelViewer";

const rootReducer = combineReducers({
  modelViewerState: modelViewerReducer,
  materialSettingState: materialSettingReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
