import { ModelState } from "../../components/ModelRender";

export default interface ModelViewerState {
  modelSelection?: ModelSelection;
  modelState: ModelState;
  cameraState: CameraState;
  selectedFrame?: string;
}
