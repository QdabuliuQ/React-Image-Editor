export default [
  {
    title: "水平翻转",
    type: "switch",
    name: "flipX",
  },
  {
    title: "垂直翻转",
    type: "switch",
    name: "flipY",
  },
  {
    title: "边框颜色",
    type: "colorPicker",
    name: "stroke",
  },
  {
    title: "边框宽度",
    type: "inputNumber",
    name: "strokeWidth",
  },
  {
    title: "倾斜X",
    type: "inputNumber",
    name: "skewX",
  },
  {
    title: "倾斜Y",
    type: "inputNumber",
    name: "skewY",
  },
  {
    title: "透明度",
    type: "slider",
    property: {
      max: 1,
      min: 0,
      step: 0.1,
    },
    name: "opacity",
  },
];
