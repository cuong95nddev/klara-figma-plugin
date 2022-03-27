import {
  emit,
  getSceneNodeById,
  getSelectedNodesOrAllNodes,
  on,
  setRelaunchButton,
  showUI,
} from "@create-figma-plugin/utilities";
import {
  ExportImage,
  NodeSelected,
  SelectionChangedHandler,
  StartPluginHandler,
} from "./events";
import { ExportImageHandler } from "./events/ExportImageHandler";
import { MaterialTexture } from "./features/ModelViewer";
import ModelViewerState from "./features/ModelViewer/ModelViewerState";
import { createImageNode } from "./utilities/imageNodeUtils";

const handleSelectionChanged = async (): Promise<void> => {
  const nodes: SceneNode[] = getSelectedNodesOrAllNodes();

  if (!nodes.length) {
    return;
  }

  const node = nodes[0];
  const nodeBlob = await (node as ExportMixin).exportAsync({
    format: "JPG",
    constraint: {
      type: "SCALE",
      value: 1
    }
  });
  emit<SelectionChangedHandler>("SELECTION_CHANGED", {
    selectedNode: {
      nodeBlob: nodeBlob,
      nodeId: node.id,
    },
  });
};

const handleStartPlugin = async (): Promise<void> => {
  const nodes: SceneNode[] = getSelectedNodesOrAllNodes();

  if (!nodes.length) {
    return;
  }
  const node: SceneNode = nodes[0];
  const viewerStateData = node.getPluginData("viewerState");

  if (viewerStateData) {
    let viewerState: ModelViewerState = JSON.parse(viewerStateData);
    let selectedNodes: NodeSelected[] = [];
    if (viewerState.modelSelection?.materialTextures) {
      const materialTextures: MaterialTexture[] =
        viewerState.modelSelection.materialTextures;
      for (const materialTexture of materialTextures) {
        selectedNodes.push({
          nodeId: materialTexture.nodeId,
          nodeBlob: await (
            getSceneNodeById(materialTexture.nodeId) as ExportMixin
          ).exportAsync(),
        });
      }
    }

    emit<StartPluginHandler>("START_PLUGIN", {
      viewerState: JSON.parse(viewerStateData),
      selectedNodes: selectedNodes,
    });
  } else {
    emit<StartPluginHandler>("START_PLUGIN", {
      selectedNode: {
        nodeId: node.id,
        nodeBlob: await (node as ExportMixin).exportAsync(),
      },
    });
  }
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
