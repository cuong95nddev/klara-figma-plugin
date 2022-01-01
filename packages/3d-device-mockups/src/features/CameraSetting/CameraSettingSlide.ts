import { createSlice } from "@reduxjs/toolkit";
import { CameraSettingState } from ".";
import type { RootState } from "../../stores";
import { ResetCameraTrigger } from "./ResetCameraTrigger";

const initialState: CameraSettingState = {
  resetCameraTrigger: ResetCameraTrigger.FINISHED,
};

export const slice = createSlice({
  name: "cameraSettingState",
  initialState,
  reducers: {
    triggerResetCamera: (state) => {
      state.resetCameraTrigger = ResetCameraTrigger.START;
    },

    resettingCamera: (state) => {
      state.resetCameraTrigger = ResetCameraTrigger.RESETTING;
    },

    finishResetCamera: (state) => {
      state.resetCameraTrigger = ResetCameraTrigger.FINISHED;
    },
  },
});

export const { triggerResetCamera, resettingCamera, finishResetCamera } =
  slice.actions;

export const selectViewer = (state: RootState) => state.cameraSettingState;

export default slice.reducer;
