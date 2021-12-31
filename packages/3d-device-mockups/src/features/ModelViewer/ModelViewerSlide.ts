import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModelSelection } from ".";
import { CameraState } from "../../components/Camera";
import type { RootState } from "../../stores";
import { Vector3 } from "../../types/Vector";
import ModelViewerState from "./ModelViewerState";

const initialState: ModelViewerState = {
  modelState: {
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
      azimuth: 0,
      polar: 0,
    },
    distance: 0,
  },
};

export const slice = createSlice({
  name: "modelViewerState",
  initialState,
  reducers: {
    updateModelSelection: (state, action: PayloadAction<ModelSelection>) => {
      state.modelSelection = action.payload;
    },
    updateCameraState: (state, action: PayloadAction<CameraState>) => {
      state.cameraState = action.payload;
    },
    updateSelectedFrame: (state, action: PayloadAction<string>) => {
      state.selectedFrame = action.payload;
    },
    updateModelPosition: (state, action: PayloadAction<Vector3>) => {
      state.modelState.position = action.payload;
    },
    updateModelRotation: (state, action: PayloadAction<Vector3>) => {
      state.modelState.rotation = action.payload;
    },
  },
});

export const {
  updateModelSelection,
  updateCameraState,
  updateSelectedFrame,
  updateModelPosition,
  updateModelRotation,
} = slice.actions;

export const selectViewer = (state: RootState) => state.modelViewerState;

export default slice.reducer;
