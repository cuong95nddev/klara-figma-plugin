import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CameraState } from "../../components/Camera";
import defaultModel from "../../components/ModelRender/DefaultModel";
import type { RootState } from "../../stores";
import ModelViewerState from "./ModelViewerState";

const loadDefaultModel = (): string => {
  if (!defaultModel.length) {
    return "";
  }

  return defaultModel[0].path;
};

const initialState: ModelViewerState = {
  modelRenderState: {
    path: loadDefaultModel(),
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
  cameraState: {
    angle: {
      azimuth: 2,
      polar: 0,
    },
    distance: 0.2,
  },
};

export const slice = createSlice({
  name: "modelViewerState",
  initialState,
  reducers: {
    updateModelPath: (state, action: PayloadAction<string>) => {
      state.modelRenderState.path = action.payload;
    },
    updateCameraState: (state, action: PayloadAction<CameraState>) => {
      state.cameraState = action.payload;
    },
  },
});

export const { updateModelPath, updateCameraState } = slice.actions;

export const selectViewer = (state: RootState) => state.modelViewerState;

export default slice.reducer;
