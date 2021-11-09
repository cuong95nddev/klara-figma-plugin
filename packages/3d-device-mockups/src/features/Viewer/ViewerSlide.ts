import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CameraState } from "../../components/Camera";
import type { RootState } from "../../stores";
import ViewerState from "./ViewerState";

const initialState: ViewerState = {
  camera: {
    angle: {
      azimuth: 0,
      polar: 0,
    },
    distance: 5
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
    }
  },
};

export const viewerSlice = createSlice({
  name: "viewerState",
  initialState,
  reducers: {
    updateCameraState: (
      state,
      action: PayloadAction<CameraState>
    ) => {
      return { ...state, camera: action.payload};
    },
  },
});

export const { updateCameraState } = viewerSlice.actions;

export const selectViewer = (state: RootState) => state.viewerState;

export default viewerSlice.reducer;
