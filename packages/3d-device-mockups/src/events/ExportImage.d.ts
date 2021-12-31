import ImageNodePlainObject from "../features/ModelViewer/ImageNodePlainObject";
import ModelViewerState from "../features/ModelViewer/ModelViewerState";

export default interface ExportImage {
  viewerState: ModelViewerState;
  image: ImageNodePlainObject; 
}
