export default [
  {
    title: "左边距",
    type: "inputNumber",
    property: {
      min: 0,
      max: 99999,
      precision: 0,
    },
    name: "left",
  },
  {
    title: "上边距",
    type: "inputNumber",
    property: {
      min: 0,
      max: 99999,
      precision: 0,
    },
    name: "top",
  },
  {
    title: "宽度",
    type: "inputNumber",
    property: {
      min: 0,
      max: 99999,
      precision: 0,
    },
    name: "width",
  },
  {
    title: "高度",
    type: "inputNumber",
    property: {
      min: 0,
      max: 99999,
      precision: 0,
    },
    name: "height",
  },
  {
    title: "旋转角度",
    type: "inputNumber",
    property: {
      min: 0,
      max: 360,
      precision: 0,
    },
    name: "angle",
  },
  {
    title: "字体颜色",
    type: "colorPicker",
    property: {},
    name: "fill",
  },
  {
    title: "字体大小",
    type: "inputNumber",
    property: {
      min: 0,
      max: 500,
      precision: 0,
    },
    name: "fontSize",
  },
  {
    title: "背景颜色",
    type: "colorPicker",
    property: {},
    name: "backgroundColor",
  },
  {
    title: "对齐方式",
    type: "select",
    property: {
      options: [
        {
          label: "左对齐",
          value: "left",
        },
        {
          label: "右对齐",
          value: "right",
        },
        {
          label: "居中",
          value: "center",
        },
        {
          label: "两端对齐",
          value: "justify",
        },
        {
          label: "两端对齐（左）",
          value: "justify-left",
        },
        {
          label: "两端对齐（右）",
          value: "justify-right",
        },
      ],
    },
    name: "textAlign",
  },
  {
    title: "行高",
    type: "inputNumber",
    property: {
      min: 0,
      max: 500,
      precision: 0,
    },
    name: "lineHeight",
  },
  {
    title: "上划线",
    type: "switch",
    property: {},
    name: "overline",
  },
  {
    title: "下划线",
    type: "switch",
    property: {},
    name: "underline",
  },
  {
    title: "删除线",
    type: "switch",
    property: {},
    name: "linethrough",
  },
  {
    title: "字体风格",
    type: "select",
    property: {
      options: [
        {
          label: "默认",
          value: "normal",
        },
        {
          label: "italic",
          value: "italic",
        },
        {
          label: "oblique",
          value: "oblique",
        },
      ],
    },
    name: "fontStyle",
  },
];
