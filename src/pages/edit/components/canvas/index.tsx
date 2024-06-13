import { memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fabric } from "fabric";

import events from "@/bus";
import initAligningGuidelines from "@/libs/guidelines";
import { updateActive } from "@/store/actions/active";
import { addElement } from "@/store/actions/element";
import { Shape } from "@/types/shape";
import * as createMethods from "@/utils/element";
import { createShapeElement } from "@/utils/element";

import "./index.less";

const elementMap = new Map();
let canvas: any;
function Canvas() {
  const dispatch = useDispatch();

  // 删除元素
  const deleteElementEvent = (id: string) => {
    canvas.remove(elementMap.get(id));
    elementMap.delete(id);
  };

  interface Options {
    svg: string;
    shape: Shape;
  }

  // 创建元素
  function createElementEvent<T extends string>(
    type: T,
    options?: T extends "svg" ? Options : never
  ) {
    if (type === "svg") {
      createShapeElement(options as Options, (element: any) => {
        elementMap.set(element._data.id, element);
        dispatch(addElement(element.toObject()));
        canvas.add(element);
        canvas.setActiveObject(element);
      });
    } else {
      const element = (createMethods as any)[`create${type}Element`]();
      elementMap.set(element._data.id, element);
      dispatch(addElement(element.toObject()));
      canvas.add(element);
      canvas.setActiveObject(element);
    }
  }

  // 激活元素
  const setActiveElementEvent = (id: string) => {
    dispatch(updateActive(id));
  };

  // 渲染元素
  const renderElementEvent = (data: {
    key: string;
    value: string | number | boolean;
    active: string;
  }) => {
    if (elementMap.has(data.active)) {
      elementMap.get(data.active).set({
        [data.key]: data.value,
      });
      canvas.renderAll();
    }
  };

  // 元素层级状态改变
  const updateElementLayoutEvent = (data: { type: string; active: string }) => {
    if (elementMap.has(data.active)) {
      canvas[data.type](elementMap.get(data.active));
    }
  };

  useEffect(() => {
    canvas = new fabric.Canvas("c", {
      backgroundColor: "#e5e5e5",
      selection: false, // 画布不显示选中
      width: 500,
      height: 700,
      fireRightClick: true, //右键点击事件生效
      stopContextMenu: true, //右键点击禁用默认自带的目录
      fireMiddleClick: true, //中间建点击事件生效
      transparentCorners: false,
    });

    initAligningGuidelines(canvas);

    events.addListener("createElement", createElementEvent);
    events.addListener("deleteElement", deleteElementEvent);
    events.addListener("setActiveElement", setActiveElementEvent);
    events.addListener("renderElement", renderElementEvent);
    events.addListener("updateElementLayout", updateElementLayoutEvent);

    return () => {
      events.removeAllListeners("createElement");
      events.removeAllListeners("deleteElement");
      events.removeAllListeners("setActiveElement");
      events.removeAllListeners("renderElement");
      events.removeAllListeners("updateElementLayout");

      canvas.dispose();
      canvas = null;
    };

    // const rect = new fabric.Rect({
    //   left: 100,
    //   top: 200,
    //   originX: "left",
    //   originY: "top",
    //   width: 150,
    //   height: 120,
    //   angle: 180,
    //   fill: "rgba(255,0,0,0.5)",
    //   ...options,
    //   _data: {
    //     id: "aLKSD0123",
    //     type: "rect",
    //   },
    // });
    // rect.toObject = (function (toObject) {
    //   return function (this: any) {
    //     return fabric.util.object.extend(toObject.call(this), {
    //       _data: this._data,
    //     });
    //   };
    // })(rect.toObject);
    // canvas.add(rect);

    // rect.on("selected", function (options: any) {
    //   dispatch(updateActive(options.target._data.id));
    // });

    // // 监听元素取消选中事件
    // rect.on("deselected", function () {
    //   dispatch(updateActive(""));
    // });

    // rect.controls.deleteControl = new fabric.Control({
    //   x: 0.5,
    //   y: -0.5,
    //   offsetY: 16,
    //   cursorStyle: "pointer",
    //   mouseUpHandler: deleteObject,
    //   render: renderIcon,
    //   cornerSize: 24,
    // });
  }, []);

  return (
    <div className="canvas-component">
      <div className="canvas-main">
        <canvas id="c"></canvas>
      </div>
    </div>
  );
}

export default memo(Canvas);
