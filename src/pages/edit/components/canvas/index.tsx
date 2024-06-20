import { memo, useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fabric } from "fabric";

import events from "@/bus";
import ButtonController from "@/components/buttonController";
import useCanvasHandle from "@/hooks/useCanvasHandle";
import initAligningGuidelines from "@/libs/guidelines";
import { updateActive } from "@/store/actions/active";
import { addElement } from "@/store/actions/element";
import { Shape } from "@/types/shape";
import { calcCanvasZoomLevel } from "@/utils/canvas";
import debounce from "@/utils/debounce";
import * as createMethods from "@/utils/element";
import { createShapeElement } from "@/utils/element";
import initCanvas from "@/utils/initCanvas";

import style from "./index.module.less";

const elementMap = new Map();
let canvasDom: HTMLCanvasElement;
let sketch: any;
function Canvas() {
  const workspaceEl = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const pressSpace = useRef(false);

  const canvas = useRef<any>();

  const { zoom, setZoom, scaleDownEvent, scaleUpEvent, clearEvent } =
    useCanvasHandle();
  const _scaleDownEvent = useCallback(
    () => scaleDownEvent(canvas.current),
    [zoom]
  );
  const _scaleUpEvent = useCallback(() => scaleUpEvent(canvas.current), [zoom]);
  const _clearEvent = useCallback(
    () => clearEvent(canvas.current, elementMap),
    []
  );
  const scaleInitEvent = useCallback(() => {
    const zoomLevel = calcCanvasZoomLevel(
      {
        width: canvas.current.width,
        height: canvas.current.height,
      },
      {
        width,
        height,
      }
    );
    initCanvas(canvas.current, sketch, zoomLevel);
    setZoom(zoomLevel);
  }, []);

  // 删除元素
  const deleteElementEvent = (id: string) => {
    canvas.current.remove(elementMap.get(id));
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
        canvas.current.add(element);
        canvas.current.setActiveObject(element);
      });
    } else {
      const element = (createMethods as any)[`create${type}Element`]();
      elementMap.set(element._data.id, element);
      dispatch(addElement(element.toObject()));
      canvas.current.add(element);
      canvas.current.setActiveObject(element);
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
      canvas.current.renderAll();
    }
  };

  // 元素层级状态改变
  const updateElementLayoutEvent = (data: { type: string; active: string }) => {
    if (elementMap.has(data.active)) {
      canvas.current[data.type](elementMap.get(data.active));
    }
  };

  // 窗口调整
  const resizeEvent = () => {
    const { width, height } = (
      document.getElementById("canvas-component") as HTMLDivElement
    ).getBoundingClientRect();

    canvas.current.setWidth(width);
    canvas.current.setHeight(height);
  };

  // 空格按下
  const keypressEvent: (event: Event) => void = (event: any) => {
    if (event.code === "Space" && !pressSpace.current) {
      pressSpace.current = true;
      canvasDom.style.cursor = "grab";

      document.removeEventListener("keypress", keypressEvent);
    }
  };

  // 空格抬起
  const keyupEvent: (event: Event) => void = (event: any) => {
    if (event.code === "Space") {
      pressSpace.current = false;
      canvasDom.style.cursor = "default";
      document.addEventListener("keypress", keypressEvent);
    }
  };

  let width = 500,
    height = 600;

  // 元素位置修改
  const updateElementPositionEvent = (data: {
    position: string;
    active: string;
  }) => {
    const { position, active } = data;

    const element = elementMap.get(active);
    if (!element) return;
    if (position === "align-left") {
      element.set({
        left: 0,
      });
    } else if (position === "align-center") {
      element.set({
        left: width / 2 - element.width / 2,
      });
    } else if (position === "align-right") {
      element.set({
        left: width - element.width,
      });
    } else if (position === "align-justify") {
      element.set({
        left: width / 2 - element.width / 2,
        top: height / 2 - element.height / 2,
      });
    } else if (position === "align-top") {
      element.set({
        top: 0,
      });
    } else if (position === "align-vertically") {
      element.set({
        top: height / 2 - element.height / 2,
      });
    } else if (position === "align-bottom") {
      element.set({
        top: height - element.height,
      });
    }
    canvas.current.renderAll();
  };

  // 画布更新
  const updateCanvasEvent = (data: { key: string; value: any }) => {
    const { key, value } = data;
    sketch.set({
      [key]: value,
    });

    if (key === "width") {
      width = value;
    } else if (key === "height") {
      height = value;
    }
    if (key === "width" || key === "height") {
      const zoomLevel = calcCanvasZoomLevel(
        {
          width: canvas.current.width,
          height: canvas.current.height,
        },
        {
          width,
          height,
        }
      );
      initCanvas(canvas.current, sketch, zoomLevel);
      setZoom(zoomLevel);
    }
  };

  // 缩放初始化
  const initScale = () => {
    const zoomLevel = calcCanvasZoomLevel(
      {
        width: canvas.current.width,
        height: canvas.current.height,
      },
      {
        width,
        height,
      }
    );
    setZoom(zoomLevel);
    initCanvas(canvas.current, sketch, zoomLevel);
  };

  useEffect(() => {
    if (canvas.current) return;
    canvas.current = new fabric.Canvas("c", {
      selection: false, // 画布不显示选中
      fireRightClick: true, //右键点击事件生效
      stopContextMenu: true, //右键点击禁用默认自带的目录
      fireMiddleClick: true, //中间建点击事件生效
      transparentCorners: false,
      allowTouchScrolling: true,
    });

    canvasDom = document.getElementsByClassName(
      "upper-canvas"
    )[0] as HTMLCanvasElement;

    // 画布元素
    sketch = new fabric.Rect({
      fill: "#ffffff",
      left: 0,
      top: 0,
      width,
      height,
      selectable: false,
      hasControls: false,
      hoverCursor: "default",
    });

    canvas.current.add(sketch);

    initScale();

    // 画布缩放
    canvas.current.on("mouse:wheel", (opt: any) => {
      const delta = opt.e.deltaY; // 滚轮，向上滚一下是 -100，向下滚一下是 100
      let zoom = canvas.current.getZoom(); // 获取画布当前缩放值
      zoom *= 0.999 ** delta;

      if (zoom > 8) zoom = 8; // 限制最大缩放级别
      else if (zoom < 0.1) zoom = 0.1; // 限制最小缩放级别
      // 以鼠标所在位置为原点缩放
      canvas.current.zoomToPoint(
        {
          // 关键点
          x: opt.e.offsetX,
          y: opt.e.offsetY,
        },
        zoom // 传入修改后的缩放级别
      );
      setZoom(zoom);
    });

    //鼠标按下事件
    canvas.current.on("mouse:down", function (this: any, opt: any) {
      const evt = opt.e;
      if (pressSpace.current) {
        this.isDragging = true;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
        canvasDom.style.cursor = "grabbing";
      }
    });
    //鼠标抬起事件
    canvas.current.on("mouse:up", function (this: any) {
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      if (pressSpace.current) {
        canvasDom.style.cursor = "grab";
      } else {
        canvasDom.style.cursor = "default";
      }
    });

    // 移动画布事件
    canvas.current.on("mouse:move", function (this: any, opt: any) {
      if (this.isDragging && pressSpace.current) {
        const e = opt.e;
        const vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
        canvasDom.style.cursor = "grabbing";
      } else if (pressSpace.current) {
        canvasDom.style.cursor = "grab";
      }
    });

    // 添加参考线
    initAligningGuidelines(canvas.current);

    resizeEvent();
    window.addEventListener("resize", debounce(resizeEvent, 100));
    events.addListener("createElement", createElementEvent);
    events.addListener("deleteElement", deleteElementEvent);
    events.addListener("setActiveElement", setActiveElementEvent);
    events.addListener("renderElement", renderElementEvent);
    events.addListener("updateElementLayout", updateElementLayoutEvent);
    events.addListener("updateElementPosition", updateElementPositionEvent);
    events.addListener("updateCanvas", updateCanvasEvent);

    document.addEventListener("keypress", keypressEvent);
    document.addEventListener("keyup", keyupEvent);

    return () => {
      events.removeAllListeners("createElement");
      events.removeAllListeners("deleteElement");
      events.removeAllListeners("setActiveElement");
      events.removeAllListeners("renderElement");
      events.removeAllListeners("updateElementLayout");
      events.removeAllListeners("updateElementPosition");
      events.removeAllListeners("updateCanvas");
      document.removeEventListener("keypress", keypressEvent);
      document.removeEventListener("keyup", keyupEvent);

      canvas.current.dispose();
      canvas.current = null;
    };
  }, []);

  return (
    <div id="canvas-component" className={style["canvas-component"]}>
      <div ref={workspaceEl} className={style["canvas-main"]}>
        <canvas id="c"></canvas>
      </div>
      <div className={style["canvas-info"]}>
        <ButtonController
          scaleDownEvent={_scaleDownEvent}
          scaleUpEvent={_scaleUpEvent}
          scaleInitEvent={scaleInitEvent}
          clearEvent={_clearEvent}
        />
      </div>
    </div>
  );
}

export default memo(Canvas);
