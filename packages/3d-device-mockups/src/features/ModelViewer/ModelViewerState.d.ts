import { MaterialItemState } from "../../components/MaterialItem";
import { ModelRenderState } from "../../components/ModelRender";

export default interface ModelViewerState {
  modelRenderState: ModelRenderState;
  cameraState: CameraState;
  selectedFrame?: string
}
