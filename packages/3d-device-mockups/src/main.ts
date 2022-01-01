import {
  emit,
  getSelectedNodesOrAllNodes,
  on,
  setRelaunchButton,
  showUI,
} from "@create-figma-plugin/utilities";
import {
  ExportImage,
  SelectionChangedHandler,
  StartPluginHandler,
} from "./events";
import { ExportImageHandler } from "./events/ExportImageHandler";
import { createImageNode } from "./utilities/imageNodeUtils";

const handleSelectionChanged = async (): Promise<void> => {
  const selectedNodes: SceneNode[] = getSelectedNodesOrAllNodes();
  if (!selectedNodes.length) {
    return;
  }

  const nodeBlob: Uint8Array = await (
    selectedNodes[0] as ExportMixin
  ).exportAsync();

  emit<SelectionChangedHandler>("SELECTION_CHANGED", {
    nodeBlob: nodeBlob,
  });
};

const handleStartPlugin = async (): Promise<void> => {
  const selectedNodes: SceneNode[] = getSelectedNodesOrAllNodes();

  const pluginData = selectedNodes[0].getPluginData("viewerState");
  const viewerState = pluginData ? JSON.parse(pluginData) : undefined;
  let nodeBlob: Uint8Array | undefined = selectedNodes.length
    ? await (selectedNodes[0] as ExportMixin).exportAsync()
    : undefined;

  emit<StartPluginHandler>("START_PLUGIN", {
    nodeBlob: nodeBlob,
    viewerState: viewerState,
  });
};

export default async function () {
  figma.on("run", handleStartPlugin);
  figma.on("selectionchange", handleSelectionChanged);

  on<ExportImageHandler>("EXPORT_IMAGE", (exportImage: ExportImage) => {
    const node: RectangleNode = createImageNode(exportImage.image, {
      resolution: 1,
      xOffset: 0,
      yOffset: 0,
    });

    node.setPluginData("viewerState", JSON.stringify(exportImage.viewerState));

    figma.currentPage.appendChild(node);
    figma.currentPage.selection = [node];
    figma.viewport.scrollAndZoomIntoView([node]);

    setRelaunchButton(node, "exportImage");
  });

  showUI({ width: 800, height: 600 });
}
