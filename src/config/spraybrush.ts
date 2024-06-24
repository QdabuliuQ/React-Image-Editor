import { Config } from "@/types/config";

import common from "./common";

const _common = [];
for (const item of common) {
  if (item.title === "边框颜色" || item.title === "边框宽度") continue;
  _common.push(item);
}

const config: Array<Config> = [...(_common as Array<Config>)];

export default config;
