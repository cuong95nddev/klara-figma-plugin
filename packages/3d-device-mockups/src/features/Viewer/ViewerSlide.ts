import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CameraState from "../../components/Camera/CameraState";
import ModelRenderState from "../../components/ModelRender/ModelRenderState";
import type { RootState } from "../../stores";
import ViewerState from "./ViewerState";

const initialState: ViewerState = {
  camera: {
    azimuthAngle: 0,
    polarAngle: 0,
    distance: 0,
  },
  model: {
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
};

export const viewerStateSlice = createSlice({
  name: "viewerState",
  initialState,
  reducers: {
    updateCameraState: (state, action: PayloadAction<CameraState>) => {
      return { ...state, camera: action.payload };
    },

    updateModelState: (state, action: PayloadAction<ModelRenderState>) => {
      return { ...state, model: action.payload };
    },
  },
});

export const { updateCameraState, updateModelState } = viewerStateSlice.actions;

export const selectViewer = (state: RootState) => state.viewerState;

export default viewerStateSlice.reducer;
