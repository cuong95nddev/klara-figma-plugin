import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { exportReducer } from "../features/Export";
import { cameraSettingReducer } from "../features/CameraSetting";
import { materialSettingReducer } from "../features/MaterialSetting";
import { modelViewerReducer } from "../features/ModelViewer";

const rootReducer = combineReducers({
  modelViewerState: modelViewerReducer,
  materialSettingState: materialSettingReducer,
  exportState: exportReducer,
  cameraSettingState: cameraSettingReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
