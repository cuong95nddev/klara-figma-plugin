import { EventHandler } from "@create-figma-plugin/utilities";
import ImageNodePlainObject from "../features/ModelViewer/ImageNodePlainObject";

export interface ExportImageHandler extends EventHandler {
  name: 'EXPORT_IMAGE'
  handler: (image: ImageNodePlainObject) => void
}
