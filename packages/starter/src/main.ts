import {
    emit,
    getSelectedNodesOrAllNodes,
    showUI,
  } from "@create-figma-plugin/utilities";
  
  export default function () {
    figma.on("selectionchange", async function () {
      const selectedNodes: SceneNode[] = getSelectedNodesOrAllNodes();
    });
  
    showUI({ width: 800, height: 600 });
  }
  