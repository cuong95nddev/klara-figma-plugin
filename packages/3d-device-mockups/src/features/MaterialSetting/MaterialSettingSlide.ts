import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MaterialSettingState } from ".";
import { MaterialItemState } from "../../components/MaterialItem";
import type { RootState } from "../../stores";

const initialState: MaterialSettingState = {
  materialStates: [],
};

export const slice = createSlice({
  name: "materialSettingState",
  initialState,
  reducers: {
    updateMaterialStates: (
      state,
      action: PayloadAction<MaterialItemState[]>
    ) => {
      state.materialStates = action.payload;
    },

    updateSelectedMaterialUUID: (state, action: PayloadAction<string>) => {
      state.selectedMaterialUUID = action.payload;
    },
  },
});

export const { updateMaterialStates, updateSelectedMaterialUUID } =
  slice.actions;

export const selectViewer = (state: RootState) => state.materialSettingState;

export default slice.reducer;
