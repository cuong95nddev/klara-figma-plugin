import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MaterialTexture, ModelSelection } from ".";
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
      polar: 90,
      azimuth: 0,
    },
    distance: 0,
  },
};

export const slice = createSlice({
  name: "modelViewerState",
  initialState,
  reducers: {
    updateModelViewerState: (
      state,
      action: PayloadAction<ModelViewerState>
    ) => {
      return action.payload;
    },
    updateModelSelection: (state, action: PayloadAction<ModelSelection>) => {
      state.modelSelection = action.payload;
    },
    updateCameraState: (state, action: PayloadAction<CameraState>) => {
      state.cameraState = action.payload;
    },
    updateModelPosition: (state, action: PayloadAction<Vector3>) => {
      state.modelState.position = action.payload;
    },
    updateModelRotation: (state, action: PayloadAction<Vector3>) => {
      state.modelState.rotation = action.payload;
    },
    addMaterialTexture: (state, action: PayloadAction<MaterialTexture>) => {
      if (!state.modelSelection || !action.payload) {
        return;
      }

      if (state.modelSelection.materialTextures == undefined) {
        state.modelSelection.materialTextures = [];
      }

      state.modelSelection.materialTextures =
        state.modelSelection.materialTextures.filter(
          (i) => i.materialId !== action.payload.materialId
        );
      state.modelSelection.materialTextures.push(action.payload);
      console.log(state.modelSelection.materialTextures)
    },
  },
});

export const {
  updateModelViewerState,
  updateModelSelection,
  updateCameraState,
  updateModelPosition,
  updateModelRotation,
  addMaterialTexture
} = slice.actions;

export const selectViewer = (state: RootState) => state.modelViewerState;

export default slice.reducer;
