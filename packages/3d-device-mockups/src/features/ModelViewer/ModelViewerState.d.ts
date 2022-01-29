import { ModelSelection } from ".";
import { ModelState } from "../../components/ModelRender";
import { EnvironmentState } from "../EnvironmentSetting";

export default interface ModelViewerState {
  modelSelection?: ModelSelection;
  modelState: ModelState;
  cameraState: CameraState;
  environmentState: EnvironmentState;
}
