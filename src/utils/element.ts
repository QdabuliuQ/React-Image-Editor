import { fabric } from "fabric";

import events from "@/bus";
import { Shape } from "@/types/shape";

import getRandomID from "./randomID";

const deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

const img = document.createElement("img");
img.src = deleteIcon;

function deleteObject(_: any, transform: any) {
  const target = transform.target;
  events.emit("deleteElement", target._data.id);
}

function renderIcon(
  this: any,
  ctx: any,
  left: number,
  top: number,
  _: any,
  fabricObject: any
) {
  const size = this.cornerSize;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}

const options = {
  originX: "center",
  originY: "center",
  transparentCorners: false,
  hasControls: true,
  hasBorders: true,
  visible: true,
  cornerStyle: "circle",
  cornerSize: 15,
  borderColor: "#1677ff",
  cornerColor: "#1677ff",
  cornerStrokeColor: "#fff",
};

export const elementOptions = options;

export function _toObject(toObject: any) {
  return (function (toObject) {
    return function (this: any) {
      return fabric.util.object.extend(toObject.call(this), {
        _data: this._data,
      });
    };
  })(toObject);
}

// 元素绑定事件
export function initElementProperty(element: any) {
  // 元素添加删除按钮
  element.controls.deleteControl = new fabric.Control({
    x: 0,
    y: 0.6,
    offsetY: 10,
    cursorStyle: "pointer",
    mouseUpHandler: deleteObject,
    render: renderIcon,
    cornerSize: 18,
  });
  element.toObject = _toObject(element.toObject);

  // 如果是线段元素 跳过
  // if (element._data.type === "path") return;
  element.on("selected", function (options: any) {
    events.emit("setActiveElement", options.target._data.id);
  });

  // 监听元素取消选中事件
  element.on("deselected", function () {
    events.emit("setActiveElement", "");
  });

  element.on("modified", function (options: any) {
    if (options.target) {
      events.emit("modifiedElement", options.target.toObject());
    }
  });
}

// 创建文本
export function createTextElement(
  customOptions: { [propName: string]: any } = {}
) {
  const text = new fabric.Textbox("Lorum ipsum dolor sit amet", {
    left: 100,
    top: 100,
    width: 150,
    height: 50,
    angle: 0,
    fill: "rgba(255,0,0,0.5)",
    fontSize: 20,
    backgroundColor: "rgba(0,0,0,0)",
    textAlign: "justify-right",
    linethrough: true,
    fontStyle: "normal",
    selectable: true,
    ...options,
    _data: {
      id: getRandomID(10),
      type: "text",
    },
    ...customOptions,
  });

  initElementProperty(text);

  return text;
}

// 创建矩形
export function createRectElement(
  customOptions: { [propName: string]: any } = {}
) {
  const rect = new fabric.Rect({
    top: 100,
    left: 100,
    width: 100,
    height: 70,
    fill: "#1677ff",

    opacity: 1,
    ...options,
    _data: {
      id: getRandomID(10),
      type: "rect",
    },
    ...customOptions,
  });

  initElementProperty(rect);

  return rect;
}

// 创建圆形
export function createCircleElement(
  customOptions: { [propName: string]: any } = {}
) {
  const circle = new fabric.Circle({
    top: 100,
    left: 100,
    radius: 50,
    fill: "#1677ff",
    ...options,
    _data: {
      id: getRandomID(10),
      type: "circle",
    },
    ...customOptions,
  });

  initElementProperty(circle);

  return circle;
}

// 创建三角形
export function createTriangleElement(
  customOptions: { [propName: string]: any } = {}
) {
  const triangle = new fabric.Triangle({
    top: 100, //距离画布上边的距离
    left: 100, //距离画布左侧的距离，单位是像素
    width: 100, //矩形的宽度
    height: 70,
    fill: "#1677ff",
    ...options,
    _data: {
      id: getRandomID(10),
      type: "triangle",
    },
    ...customOptions,
  });

  initElementProperty(triangle);

  return triangle;
}

interface Config {
  svg: string;
  shape: Shape;
}
// 创建形状
export function createShapeElement(
  config: Config,
  callback: (...args: Array<any>) => void,
  customOptions: { [propName: string]: any } = {}
) {
  fabric.loadSVGFromString(config.svg, (objects: any, data: any) => {
    const loadedObject = fabric.util.groupSVGElements(objects, data);
    loadedObject.set({
      top: 50,
      left: 50,
      scaleX:
        (config as Config).shape.viewBox[0] > 1000
          ? 100 / (config as Config).shape.viewBox[0]
          : 0.5,
      scaleY:
        (config as Config).shape.viewBox[1] > 1000
          ? 100 / (config as Config).shape.viewBox[1]
          : 0.5,
      strokeWidth: (config as Config).shape.viewBox[1] > 1000 ? 50 : 10,
      stroke: "#000",
      ...options,
      _data: {
        id: getRandomID(10),
        type: "shape",
      },
      ...customOptions,
    });
    initElementProperty(loadedObject);

    callback(loadedObject);
  });
}

interface ImageOptions {
  dataUrl: string;
  width: number;
  height: number;
}

// 创建图片
export function createImageElement(
  config: ImageOptions,
  callback: (image: any) => void
) {
  fabric.Image.fromURL(config.dataUrl, function (image: any) {
    image.set({
      top: 50, //距离画布上边的距离
      left: 100, //距离画布左侧的距离，单位是像素
      scaleX: 150 / config.width,
      scaleY: 150 / config.height,
      ...options,
      _data: {
        id: getRandomID(10),
        type: "image",
      },
    });
    initElementProperty(image);
    // 如果需要，你可以在这里触发 canvas 的渲染
    callback(image);
  });
}
