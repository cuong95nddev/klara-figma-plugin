import iphone11 from "../../assets/glb/iphone-11.glb";
import iphone12 from "../../assets/glb/iphone-12.glb";
import macbookPro from "../../assets/glb/macbook-pro.glb";
import Model from "./Model";

const defaultModel: Model[] = [
  {
    id: 1,
    name: "Iphone 12",
    path: iphone12,
  },
  {
    id: 2,
    name: "Iphone 11",
    path: iphone11,
  },
  {
    id: 3,
    name: "Macbook Pro",
    path: macbookPro,
  },
];

export const findModelById = (id: number): Model | undefined =>
  defaultModel.find((m) => m.id === id);

export const getDefaultModel = (): Model => defaultModel[0];

export default defaultModel;
