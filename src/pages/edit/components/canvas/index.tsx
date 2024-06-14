import { memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fabric } from "fabric";

import events from "@/bus";
import initAligningGuidelines from "@/libs/guidelines";
import { updateActive } from "@/store/actions/active";
import { addElement } from "@/store/actions/element";
import { Shape } from "@/types/shape";
import debounce from "@/utils/debounce";
import * as createMethods from "@/utils/element";
import { createShapeElement } from "@/utils/element";

import style from "./index.module.less";

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

  const resizeEvent = () => {
    const { width, height } = (
      document.getElementById("canvas-component") as HTMLDivElement
    ).getBoundingClientRect();

    canvas.setWidth(width);
    canvas.setHeight(height);
  };

  useEffect(() => {
    canvas = new fabric.Canvas("c", {
      selection: false, // 画布不显示选中
      fireRightClick: true, //右键点击事件生效
      stopContextMenu: true, //右键点击禁用默认自带的目录
      fireMiddleClick: true, //中间建点击事件生效
      transparentCorners: false,
      allowTouchScrolling: false,
    });

    const c = new fabric.staticCanvas();

    // 画布缩放
    canvas.on("mouse:wheel", (opt: any) => {
      const delta = opt.e.deltaY; // 滚轮，向上滚一下是 -100，向下滚一下是 100
      let zoom = canvas.getZoom(); // 获取画布当前缩放值
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20; // 限制最大缩放级别
      if (zoom < 0.01) zoom = 0.01; // 限制最小缩放级别
      // 以鼠标所在位置为原点缩放
      canvas.zoomToPoint(
        {
          // 关键点
          x: opt.e.offsetX,
          y: opt.e.offsetY,
        },
        zoom // 传入修改后的缩放级别
      );
    });

    //鼠标按下事件
    canvas.on("mouse:down", function (this: any) {
      this.panning = true;
      canvas.selection = false;
    });
    //鼠标抬起事件
    canvas.on("mouse:up", function (this: any) {
      this.panning = false;
      canvas.selection = true;
    });
    // 移动画布事件
    canvas.on("mouse:move", function (this: any, e: any) {
      if (this.panning && e && e.e) {
        const delta = new fabric.Point(e.e.movementX, e.e.movementY);
        canvas.relativePan(delta);
      }
    });

    // 添加参考线
    initAligningGuidelines(canvas);

    resizeEvent();
    window.addEventListener("resize", debounce(resizeEvent, 100));
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
  }, []);

  return (
    <div id="canvas-component" className={style["canvas-component"]}>
      <div className={style["canvas-main"]}>
        <canvas id="c"></canvas>
      </div>
    </div>
  );
}

export default memo(Canvas);
