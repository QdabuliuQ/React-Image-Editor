import { Config } from "@/types/config";

import common from "./common";

const config: Array<Config> = [
  ...(common as Array<Config>),
  {
    type: "colorPicker",
    title: "颜色",
    name: "stroke",
  },
];

export default config;
