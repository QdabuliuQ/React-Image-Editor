import { fabric } from "fabric";

import events from "@/bus";

import getRandomID from "./randomID";

const deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

const img = document.createElement("img");
img.src = deleteIcon;

function deleteObject(eventData: any, transform: any) {
  const target = transform.target;
  const canvas = target.canvas;
  canvas.remove(target);
  canvas.requestRenderAll();
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

function _toObject(toObject: any) {
  return (function (toObject) {
    return function (this: any) {
      return fabric.util.object.extend(toObject.call(this), {
        _data: this._data,
      });
    };
  })(toObject);
}

export function createTextElement() {
  const text = new fabric.Textbox("Lorum ipsum dolor sit amet", {
    left: 50,
    top: 50,
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
  });

  text.controls.deleteControl = new fabric.Control({
    x: 0,
    y: 0.7,
    offsetY: 16,
    cursorStyle: "pointer",
    mouseUpHandler: deleteObject,
    render: renderIcon,
    cornerSize: 18,
  });
  text.toObject = _toObject(text.toObject);

  text.on("selected", function (options: any) {
    events.emit("setActiveElement", options.target._data.id);
  });

  // 监听元素取消选中事件
  text.on("deselected", function () {
    events.emit("setActiveElement", "");
  });

  text.on("modified", function (options: any) {
    events.emit("modifiedElement", options.target.toObject());
  });

  return text;
}
