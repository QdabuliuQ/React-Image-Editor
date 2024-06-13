export default [
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
      precision: 2,
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
  {
    title: "描边颜色",
    type: "colorPicker",
    name: "stroke",
  },
  {
    title: "描边宽度",
    type: "inputNumber",
    property: {
      min: 0,
      max: 100,
    },
    name: "strokeWidth",
  },
];
