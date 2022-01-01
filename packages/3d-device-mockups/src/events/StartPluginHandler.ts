import { EventHandler } from "@create-figma-plugin/utilities";
import { StartPlugin } from ".";

export default interface StartPluginHandler extends EventHandler {
  name: "START_PLUGIN";
  handler: (startPlugin: StartPlugin) => void;
}
