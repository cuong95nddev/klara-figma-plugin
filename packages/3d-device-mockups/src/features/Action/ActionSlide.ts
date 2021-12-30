import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActionState, ExportImageState } from ".";
import type { RootState } from "../../stores";

const defaultExportImageState = ExportImageState.FINISHED;

const initialState: ActionState = {
  exportImage: defaultExportImageState,
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
  },
});

export const { updateExportImageState } = slice.actions;

export const selectViewer = (state: RootState) => state.actionState;

export default slice.reducer;
