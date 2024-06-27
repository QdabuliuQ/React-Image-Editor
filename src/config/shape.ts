import { Config, ControllerType } from "@/types/config";

import common from "./common";

const config: Array<Config> = [
  ...(common as Array<Config>),
  {
    type: ControllerType.colorPicker,
    title: "颜色",
    name: "fill",
  },
];

export default config;
