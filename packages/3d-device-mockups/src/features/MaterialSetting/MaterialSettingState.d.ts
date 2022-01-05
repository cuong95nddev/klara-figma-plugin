import { MaterialItemState } from "../../components/MaterialItem";

export default interface MaterialSettingState {
  loadTextureMaterialName?: string
  selectedMaterialId?: number;
  materialStates: MaterialItemState[];
}
