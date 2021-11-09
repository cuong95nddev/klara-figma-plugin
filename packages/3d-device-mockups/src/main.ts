import {
  emit,
  getSelectedNodesOrAllNodes,
  showUI,
} from "@create-figma-plugin/utilities";
import { SelectionChangedHandler } from "./events";

export default function () {
  figma.on("selectionchange", async function () {
    const selectedNodes: SceneNode[] = getSelectedNodesOrAllNodes();
    if (!selectedNodes.length) {
      return;
    }
    const firstSelectedNode: ExportMixin = selectedNodes[0] as ExportMixin;
    const nodeBlob: Uint8Array = await firstSelectedNode.exportAsync();
    
    emit<SelectionChangedHandler>("SELECTION_CHANGED", nodeBlob);
  });

  showUI({ width: 800, height: 600 });
}
