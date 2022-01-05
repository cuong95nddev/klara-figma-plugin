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

    updateSelectedMaterialUUID: (state, action: PayloadAction<number>) => {
      state.selectedMaterialId = action.payload;
    },

    loadTextureForMaterial: (state, action: PayloadAction<string>) => {
      state.loadTextureMaterialName = action.payload;
    },
    loadTextureForMaterialDone: (state) => {
      state.loadTextureMaterialName = undefined;
    },
  },
});

export const {
  updateMaterialStates,
  updateSelectedMaterialUUID,
  loadTextureForMaterial,
  loadTextureForMaterialDone,
} = slice.actions;

export const selectViewer = (state: RootState) => state.materialSettingState;

export default slice.reducer;
