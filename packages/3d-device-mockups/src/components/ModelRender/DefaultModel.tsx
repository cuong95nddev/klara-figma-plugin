
import iphone13 from "../../assets/glb/iphone13-POC.glb";
import Model from "./Model";

const defaultModel: Model[] = [
  {
    id: 1,
    name: "Iphone 13",
    path: iphone13
  }
];

export const findModelById = (id: number): Model | undefined =>
  defaultModel.find((m) => m.id === id);

export const getDefaultModel = (): Model => defaultModel[0];

export default defaultModel;
