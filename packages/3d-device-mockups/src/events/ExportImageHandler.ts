import { EventHandler } from "@create-figma-plugin/utilities";
import { ExportImage } from ".";

export interface ExportImageHandler extends EventHandler {
  name: "EXPORT_IMAGE";
  handler: (exportImage: ExportImage) => void;
}
