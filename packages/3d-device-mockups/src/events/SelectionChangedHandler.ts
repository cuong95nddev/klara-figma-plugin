import { EventHandler } from "@create-figma-plugin/utilities";

export interface SelectionChangedHandler extends EventHandler {
  name: 'SELECTION_CHANGED'
  handler: (node: Uint8Array) => void
}
