import iphone13Pro from "../../assets/glb/iPhone 13 Pro.glb";
import iphone11 from "../../assets/glb/iphone-11.glb";
import iphone12 from "../../assets/glb/iphone-12.glb";
import macbookPro from "../../assets/glb/macbook-pro.glb";
import Model from "./Model";

const defaultModel: Model[] = [
  {
    id: 0,
    name: "iphone13Pro",
    path: iphone13Pro,
  },
  {
    id: 1,
    name: "iphone12",
    path: iphone12,
  },
  {
    id: 2,
    name: "iphone 11",
    path: iphone11,
  },
  {
    id: 3,
    name: "macbookPro",
    path: macbookPro,
  },
];

export default defaultModel;
