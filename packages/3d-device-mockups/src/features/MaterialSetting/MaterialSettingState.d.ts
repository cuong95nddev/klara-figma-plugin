import { MaterialItemState } from "../../components/MaterialItem";

export default interface MaterialSettingState {
  selectedMaterialUUID?: string;
  materialStates: MaterialItemState[];
}
