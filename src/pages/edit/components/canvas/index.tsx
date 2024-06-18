import { memo, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fabric } from "fabric";

import events from "@/bus";
import initAligningGuidelines from "@/libs/guidelines";
import { updateActive } from "@/store/actions/active";
import { addElement } from "@/store/actions/element";
import { Shape } from "@/types/shape";
import { calcCanvasZoomLevel } from "@/utils/canvas";
import debounce from "@/utils/debounce";
import * as createMethods from "@/utils/element";
import { createShapeElement } from "@/utils/element";

import style from "./index.module.less";

const elementMap = new Map();
let canvas: any;
function Canvas() {
  const workspaceEl = useRef<HTMLDivElement>(null);
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
      allowTouchScrolling: true,
    });

    const sketch = new fabric.Rect({
      fill: "#ffffff",
      left: 0,
      top: 0,
      width: 500,
      height: 600,
      selectable: false,
      hasControls: false,
      hoverCursor: "default",
    });

    canvas.add(sketch);

    const zoomLevel = calcCanvasZoomLevel(
      {
        width: canvas.width,
        height: canvas.height,
      },
      {
        width: 500,
        height: 600,
      }
    );

    const center = canvas.getCenter();
    canvas.zoomToPoint(
      new fabric.Point(center.left, center.top),
      zoomLevel - 0.04
    );

    // sketch 移至画布中心
    const sketchCenter = sketch.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;
    viewportTransform[4] =
      canvas.width / 2 - sketchCenter.x * viewportTransform[0];
    viewportTransform[5] =
      canvas.height / 2 - sketchCenter.y * viewportTransform[3];
    canvas.setViewportTransform(viewportTransform);
    canvas.requestRenderAll();

    sketch.clone((cloned: any) => {
      canvas.clipPath = cloned;
      canvas.requestRenderAll();
    });

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
    canvas.on("mouse:down", function (this: any, opt: any) {
      const evt = opt.e;
      if (evt.altKey === true) {
        this.isDragging = true;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
        // this.panning = true;
        // canvas.selection = false;
      }
    });
    //鼠标抬起事件
    canvas.on("mouse:up", function (this: any) {
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
    });
    // 移动画布事件
    canvas.on("mouse:move", function (this: any, opt: any) {
      if (this.isDragging) {
        const e = opt.e;
        const vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
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
      <div ref={workspaceEl} className={style["canvas-main"]}>
        <canvas id="c"></canvas>
      </div>
    </div>
  );
}

export default memo(Canvas);
