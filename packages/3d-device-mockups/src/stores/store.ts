import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { viewerReducer } from "../features/Viewer";

const rootReducer = combineReducers({
  viewerState: viewerReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
