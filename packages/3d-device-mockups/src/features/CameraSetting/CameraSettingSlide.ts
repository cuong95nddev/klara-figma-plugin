import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CameraSettingState } from ".";
import type { RootState } from "../../stores";
import { ResetCameraAction } from "./ResetCameraAction";

const initialState: CameraSettingState = {
  resetCameraAction: ResetCameraAction.FINISHED,
};

export const slice = createSlice({
  name: "cameraSettingActionState",
  initialState,
  reducers: {
    startResetCameraAction: (
      state
    ) => {
      state.resetCameraAction = ResetCameraAction.START;
    },

    finishResetCameraAction: (
      state
    ) => {
      state.resetCameraAction = ResetCameraAction.FINISHED;
    },
  },
});

export const { startResetCameraAction, finishResetCameraAction } =
  slice.actions;

export const selectViewer = (state: RootState) => state.cameraSettingState;

export default slice.reducer;
