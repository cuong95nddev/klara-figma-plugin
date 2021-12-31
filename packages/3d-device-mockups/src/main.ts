import {
  emit,
  getSelectedNodesOrAllNodes,
  on,
  setRelaunchButton,
  showUI,
} from "@create-figma-plugin/utilities";
import { ExportImage, SelectionChangedHandler } from "./events";
import { ExportImageHandler } from "./events/ExportImageHandler";
import { createImageNode } from "./utilities/imageNodeUtils";

const getSelectedNodeBlob = async (): Promise<Uint8Array | null> => {
  const selectedNodes: SceneNode[] = getSelectedNodesOrAllNodes();

  if (!selectedNodes.length) {
    return null;
  }
  const firstSelectedNode: ExportMixin = selectedNodes[0] as ExportMixin;
  const nodeBlob: Uint8Array = await firstSelectedNode.exportAsync();

  return nodeBlob;
};

const emitSelectionchange = async (): Promise<void> => {
  const nodeBlob = await getSelectedNodeBlob();
  if (!nodeBlob) {
    return;
  }
  emit<SelectionChangedHandler>("SELECTION_CHANGED", nodeBlob);
};

export default async function () {
  figma.on("run", emitSelectionchange);
  figma.on("selectionchange", emitSelectionchange);


  on<ExportImageHandler>("EXPORT_IMAGE", (exportImage: ExportImage) => {
    const node: RectangleNode = createImageNode(exportImage.image, {
      resolution: 1,
      xOffset: 0,
      yOffset: 0,
    });

    figma.currentPage.appendChild(node);
    figma.currentPage.selection = [node];
    figma.viewport.scrollAndZoomIntoView([node]);

    setRelaunchButton(node, "exportImage");
  });

  showUI({ width: 800, height: 600 });
}
