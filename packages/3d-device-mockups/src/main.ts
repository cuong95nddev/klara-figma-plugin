import {
  emit,
  getSelectedNodesOrAllNodes,
  showUI,
} from "@create-figma-plugin/utilities";
import { SelectionChangedHandler } from "./events";

const getSelectedNodeBlob = async (): Promise<Uint8Array | null> => {
  const selectedNodes: SceneNode[] = getSelectedNodesOrAllNodes();

  if (!selectedNodes.length) {
    return null;
  }
  const firstSelectedNode: ExportMixin = selectedNodes[0] as ExportMixin;
  const nodeBlob: Uint8Array = await firstSelectedNode.exportAsync();

  return nodeBlob;
};

export default function () {
  figma.on("run", async function () {
    const nodeBlob = await getSelectedNodeBlob();
    if (!nodeBlob) {
      return;
    }
    emit<SelectionChangedHandler>("SELECTION_CHANGED", nodeBlob);
  });

  figma.on("selectionchange", async function () {
    const nodeBlob = await getSelectedNodeBlob();
    if (!nodeBlob) {
      return;
    }
    emit<SelectionChangedHandler>("SELECTION_CHANGED", nodeBlob);
  });

  showUI({ width: 800, height: 600 });
}
