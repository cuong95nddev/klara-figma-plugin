import CameraState from "../../components/Camera/CameraState";
import ModelRenderState from "../../components/ModelRender/ModelRenderState";

export default interface ViewerState {
  model: ModelRenderState;
  camera: CameraState;
}
