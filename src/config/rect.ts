import { Config, ControllerType } from "@/types/config";

import common from "./common";

const config: Array<Config> = [
  ...(common as Array<Config>),
  {
    title: "颜色",
    type: ControllerType.colorPicker,
    name: "fill",
  },
  {
    title: "圆角X半径",
    type: ControllerType.inputNumber,
    property: {
      min: 0,
      max: 500,
    },
    name: "rx",
  },
  {
    title: "圆角Y半径",
    type: ControllerType.inputNumber,
    property: {
      min: 0,
      max: 500,
    },
    name: "ry",
  },
];

export default config;
