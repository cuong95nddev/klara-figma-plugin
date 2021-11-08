import { EventHandler } from "@create-figma-plugin/utilities";

export interface SelectionNodeChange extends EventHandler {
  name: "SELECTION_NODE_CHANGED";
  handler: (node: string) => void;
}
