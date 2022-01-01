import { EventHandler } from "@create-figma-plugin/utilities";
import SelectionChanged from "./SelectionChanged";

export interface SelectionChangedHandler extends EventHandler {
  name: 'SELECTION_CHANGED'
  handler: (selectionChange: SelectionChanged) => void
}
