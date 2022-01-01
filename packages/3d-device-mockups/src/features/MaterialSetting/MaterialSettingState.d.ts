import { MaterialItemState } from "../../components/MaterialItem";

export default interface MaterialSettingState {
  loadTextureMaterialId?: number
  selectedMaterialId?: number;
  materialStates: MaterialItemState[];
}
