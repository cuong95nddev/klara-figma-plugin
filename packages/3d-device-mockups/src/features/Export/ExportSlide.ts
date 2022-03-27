import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExportState } from ".";
import type { RootState } from "../../stores";
import { ExportImageState } from "./ExportImageState";

const defaultExportImageState = ExportImageState.FINISHED;

const initialState: ExportState = {
  exportImage: defaultExportImageState,
  scale: 2
};

export const slice = createSlice({
  name: "actionState",
  initialState,
  reducers: {
    updateExportImageState: (
      state,
      action: PayloadAction<ExportImageState>
    ) => {
      state.exportImage = action.payload;
    },
    updateExportScale: (state, action: PayloadAction<number> ) => {
      state.scale = action.payload
    }
  },
});

export const { updateExportImageState, updateExportScale } = slice.actions;

export const selectViewer = (state: RootState) => state.exportState;

export default slice.reducer;
