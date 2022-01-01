import { MaterialTexture } from ".";

export default interface ModelSelection {
  isDefault: boolean;
  id?: number;
  materialTextures?: MaterialTexture[];
}
