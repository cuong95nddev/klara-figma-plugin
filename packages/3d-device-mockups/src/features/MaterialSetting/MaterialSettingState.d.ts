import { MaterialItemState } from "../../components/MaterialItem";

export default interface MaterialSettingState {
  loadTextureMaterialUUID?: string
  selectedMaterialUUID?: string;
  materialStates: MaterialItemState[];
}
