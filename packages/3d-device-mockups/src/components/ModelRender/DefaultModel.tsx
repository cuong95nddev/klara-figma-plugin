import iphone11 from "../../assets/glb/iphone-11.glb";
import iphone12 from "../../assets/glb/iphone-12.glb";
import macbookPro from "../../assets/glb/macbook-pro.glb";
import iMac2021 from "../../assets/glb/imac-2021.glb";
import iMacPro from "../../assets/glb/imac-pro.glb";
import iPadAir from "../../assets/glb/ipad-air.glb";
import Model from "./Model";

const defaultModel: Model[] = [
  {
    name: "Iphone 11",
    path: iphone11,
  },
  {
    name: "Iphone 12",
    path: iphone12,
  },
  {
    name: "Macbook Pro",
    path: macbookPro,
  },
  {
    name: "IMac 2021",
    path: iMac2021,
  },
  {
    name: "IMac Pro",
    path: iMacPro,
  },
  {
    name: "Ipad Air",
    path: iPadAir,
  },
];

export default defaultModel;
