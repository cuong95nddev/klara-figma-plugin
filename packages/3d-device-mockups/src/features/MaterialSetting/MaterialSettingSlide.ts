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

    loadTextureForMaterial: (state, action: PayloadAction<string>) => {
      state.loadTextureMaterialUUID = action.payload;
    },
    loadTextureForMaterialDone: (state) => {
      state.loadTextureMaterialUUID = "";
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
