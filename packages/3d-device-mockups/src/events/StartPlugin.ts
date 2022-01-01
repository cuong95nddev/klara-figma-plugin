import ModelViewerState from "../features/ModelViewer/ModelViewerState";

export default interface StartPlugin {
  nodeBlob?: Uint8Array;
  viewerState?: ModelViewerState;
}
