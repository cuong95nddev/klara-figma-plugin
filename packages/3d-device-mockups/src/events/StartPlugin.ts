import { NodeSelected } from ".";
import ModelViewerState from "../features/ModelViewer/ModelViewerState";

export default interface StartPlugin {
  selectedNode?: NodeSelected;
  viewerState?: ModelViewerState;
  selectedNodes?: NodeSelected[];
}
