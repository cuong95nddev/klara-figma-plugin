import { CameraState } from "../../components/Camera";
import { ModelRenderState } from "../../components/ModelRender";

export default interface ViewerState {
    camera: CameraState,
    model: ModelRenderState
}
