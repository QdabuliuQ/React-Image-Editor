import { ControllerType } from "@/types/config";

export default [
  {
    title: "水平翻转",
    type: ControllerType.switch,
    name: "flipX",
  },
  {
    title: "垂直翻转",
    type: ControllerType.switch,
    name: "flipY",
  },
  {
    title: "边框颜色",
    type: ControllerType.colorPicker,
    name: "stroke",
  },
  {
    title: "边框宽度",
    type: ControllerType.inputNumber,
    name: "strokeWidth",
  },
  {
    title: "倾斜X",
    type: ControllerType.inputNumber,
    name: "skewX",
  },
  {
    title: "倾斜Y",
    type: ControllerType.inputNumber,
    name: "skewY",
  },
  {
    title: "透明度",
    type: ControllerType.slider,
    property: {
      max: 1,
      min: 0,
      step: 0.1,
    },
    name: "opacity",
  },
];
