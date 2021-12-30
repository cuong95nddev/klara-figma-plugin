import { createImagePaint, traverseNode } from "@create-figma-plugin/utilities";
import ImageNodePlainObject from "../features/ModelViewer/ImageNodePlainObject";

export function getImageNodes(): Array<RectangleNode> {
  const result: Array<RectangleNode> = [];
  const nodes = figma.currentPage.selection.slice();
  for (const node of nodes) {
    traverseNode(node, function (node: SceneNode) {
      if (node.type !== "RECTANGLE") {
        return;
      }
      const fills = node.fills as Array<Paint>;
      if (fills.length !== 1 || fills[0].type !== "IMAGE") {
        return;
      }
      result.push(node);
    });
  }
  return result;
}

export function createImageNode(
  imageNodePlainObject: ImageNodePlainObject,
  options: {
    resolution: number;
    xOffset: number;
    yOffset: number;
  }
): RectangleNode {
  const { bytes, x, y, width, height } = imageNodePlainObject;
  const { resolution, xOffset, yOffset } = options;
  const rectangle = figma.createRectangle();
  rectangle.name = "Image";
  rectangle.x = x / resolution + xOffset;
  rectangle.y = y / resolution + yOffset;
  rectangle.resize(width / resolution, height / resolution);

  console.log(bytes);

  rectangle.fills = [createImagePaint(bytes)];
  return rectangle;
}
