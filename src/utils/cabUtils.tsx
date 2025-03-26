import type { StaticImageData } from "next/image";
import autoImg from "../../public/assets/cab/auto.png";
import comfortImg from "../../public/assets/cab/comfort.png";
import eliteImg from "../../public/assets/cab/elite.png";
type CabType = "Auto" | "Comfort" | "Elite";

interface CabOption {
  type: CabType;
  description: string;
  fareMultiplier: number;
  imgSrc: StaticImageData;
}

const cabOptions: CabOption[] = [
  {
    type: "Auto",
    description: "Fast and cost-effective for short rides and quick commutes",
    fareMultiplier: 1,
    imgSrc: autoImg,
  },
  {
    type: "Comfort",
    description: "Reliable and smooth for everyday travel",
    fareMultiplier: 1.3,
    imgSrc: comfortImg,
  },
  {
    type: "Elite",
    description: "Premium and luxurious for a high-end experience",
    fareMultiplier: 1.5,
    imgSrc: eliteImg,
  },
];

export default cabOptions;
