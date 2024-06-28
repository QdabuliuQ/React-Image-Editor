import { memo, useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fabric } from "fabric";

import events from "@/bus";
import ButtonController from "@/components/buttonController";
import ContextMenu from "@/components/contextMenu";
import useCanvasHandle from "@/hooks/useCanvasHandle";
import useElementContextMenu from "@/hooks/useElementContextMenu";
import useOpeHistory from "@/hooks/useOpeHistory";
import initAligningGuidelines from "@/libs/guidelines";
import { updateActive } from "@/store/modules/active/action";
import { addElement, deleteElementByIdx } from "@/store/modules/element/action";
import { Shape } from "@/types/shape";
import { calcCanvasZoomLevel } from "@/utils/canvas";
import debounce from "@/utils/debounce";
import * as createMethods from "@/utils/element";
import {
  createImageElement,
  createShapeElement,
  initElementProperty,
} from "@/utils/element";
import { exportFileToPng, exportFileToSvg } from "@/utils/exportFile";
import initCanvas from "@/utils/initCanvas";
import getRandomID from "@/utils/randomID";

import style from "./index.module.less";

let { width, height } = JSON.parse(
  sessionStorage.getItem("canvasInfo") as string
);

// const window.elementMap = new Map();
window.elementMap = new Map();

let canvasDom: HTMLCanvasElement;
let sketch: any,
  brushType = "";
function Canvas() {
  const { saveOperation } = useOpeHistory();
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
  const _clearEvent = useCallback(() => clearEvent(), []);
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
    canvas.current.remove(window.elementMap.get(id));
    window.elementMap.delete(id);
    dispatch(deleteElementByIdx(id));
    dispatch(updateActive(""));
    saveOperation();
  };

  interface SvgOptions {
    svg: string;
    shape: Shape;
  }
  interface ImageOptions {
    dataUrl: string;
    width: number;
    height: number;
  }

  // 创建元素
  function createElementEvent<T extends string>(
    type: T,
    options?: T extends "svg"
      ? SvgOptions
      : T extends "image"
      ? ImageOptions
      : never,
    customOptions: { [propName: string]: any } = {}
  ) {
    if (type === "svg") {
      createShapeElement(
        options as SvgOptions,
        (element: any) => {
          window.elementMap.set(element._data.id, element);
          dispatch(addElement(element.toObject()));
          canvas.current.add(element);
          canvas.current.setActiveObject(element);
        },
        customOptions
      );
    } else if (type === "image") {
      createImageElement(options as ImageOptions, (element: any) => {
        window.elementMap.set(element._data.id, element);
        dispatch(addElement(element.toObject()));
        canvas.current.add(element);
        canvas.current.setActiveObject(element);
      });
    } else {
      const element = (createMethods as any)[`create${type}Element`](
        customOptions
      );
      window.elementMap.set(element._data.id, element);
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
    value: string | number | boolean | Array<any>;
    active: string;
    applyFilters?: boolean;
  }) => {
    if (window.elementMap.has(data.active)) {
      const el = window.elementMap.get(data.active);
      el.set({
        [data.key]: data.value,
      });
      data.applyFilters && el.applyFilters();
      canvas.current.renderAll();
    }
  };

  // 元素层级状态改变
  const updateElementLayoutEvent = (data: { type: string; active: string }) => {
    if (window.elementMap.has(data.active)) {
      canvas.current[data.type](window.elementMap.get(data.active));
    }
  };

  // 窗口调整
  const resizeEvent = () => {
    const { width, height } = (
      document.getElementById("canvas-component") as HTMLDivElement
    ).getBoundingClientRect();

    canvas.current.setWidth(width);
    canvas.current.setHeight(height);

    scaleInitEvent();
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

  // 元素位置修改
  const updateElementPositionEvent = (data: {
    position: string;
    active: string;
  }) => {
    const { position, active } = data;
    const element = window.elementMap.get(active);
    const info = element.getBoundingRect();
    const _width = info.width,
      _height = info.height;

    if (!element) return;
    if (position === "align-left") {
      element.set({
        left: _width / 2,
      });
    } else if (position === "align-center") {
      element.set({
        left: width / 2,
      });
    } else if (position === "align-right") {
      element.set({
        left: width - _width / 2,
      });
    } else if (position === "align-justify") {
      element.set({
        left: width / 2,
        top: height / 2,
      });
    } else if (position === "align-top") {
      element.set({
        top: _height / 2,
      });
    } else if (position === "align-vertically") {
      element.set({
        top: height / 2,
      });
    } else if (position === "align-bottom") {
      element.set({
        top: height - _height / 2,
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
    if (key === "width" || key === "height") {
      initCanvas(canvas.current, sketch, zoomLevel);
      setZoom(zoomLevel);
    } else {
      canvas.current.renderAll();
    }
    scaleInitEvent();
    sessionStorage.setItem(
      "canvasInfo",
      JSON.stringify({
        width,
        height,
      })
    );
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

  // 切换笔刷模式
  const switchBrushEvent = (type: string, status: boolean) => {
    canvas.current.isDrawingMode = status;
    dispatch(updateActive(status ? type : ""));
    brushType = type.toLowerCase();
    if (status) {
      // 进入画笔模式
      // 取消激活元素
      canvas.current.discardActiveObject();
      canvas.current["freeDrawingBrush"] = new fabric[type](canvas.current);

      canvas.current["freeDrawingBrush"].limitedToCanvasSize = true;
      canvas.current.renderAll();
    } else {
      // 退出画笔模式
      canvas.current["freeDrawingBrush"] = null;
    }
    brushType = status ? brushType : "";
  };

  // 修改笔刷样式
  const pathStyleModifyEvent = (data: { key: string; value: any }) => {
    if (!canvas.current["freeDrawingBrush"]) return;
    canvas.current["freeDrawingBrush"][data.key] = data.value;
  };

  // 导出文件
  const exportFileEvent = (type: string) => {
    if (type === "png") {
      exportFileToPng(canvas.current);
    } else if (type === "svg") {
      exportFileToSvg(canvas.current);
    }
  };

  // 获取菜单项
  const {
    contextMenuRef,
    contextMenuData,
    menuClick,
    elementInfo,
    offsetX,
    offsetY,
  } = useElementContextMenu();

  const newCanvasEvent = (data: {
    width: number;
    height: number;
    color: string;
  }) => {
    sessionStorage.setItem(
      "canvasInfo",
      JSON.stringify({
        width: data.width,
        height: data.height,
      })
    );
    width = data.width;
    height = data.height;
    window._instance.set({
      width,
      height,
      color: data.color,
    });

    _clearEvent();
    scaleInitEvent();
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
    (window as any)._instance = canvas.current;

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

    // canvas.current.on("object:modified", () => {
    //   saveOperation();
    // });
    // canvas.current.on("object:added", () => {
    //   if (/.*Brush/.test(active)) return;
    //   if (
    //     sessionStorage.getItem("isOpe") === "false" ||
    //     !sessionStorage.getItem("isOpe")
    //   ) {
    //     saveOperation();
    //   }
    // });

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

      if (opt.button === 1 && pressSpace.current) {
        this.isDragging = true;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
        canvasDom.style.cursor = "grabbing";
      } else if (opt.button === 3) {
        if (!opt.target || !opt.target._data) return;
        (
          contextMenuRef.current as unknown as {
            show: (x: number, y: number) => void;
          }
        ).show(evt.clientX, evt.clientY);
        offsetX.current = evt.clientX;
        offsetY.current = evt.clientY;
        (elementInfo as any).current = opt.target;
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

    canvas.current.on("drop", function (opt: { e: any }) {
      // 画布元素距离浏览器左侧和顶部的距离
      const offset = {
        left: canvas.current.getSelectionElement().getBoundingClientRect().left,
        top: canvas.current.getSelectionElement().getBoundingClientRect().top,
      };

      // 鼠标坐标转换成画布的坐标（未经过缩放和平移的坐标）
      const point = {
        x: opt.e.x - offset.left,
        y: opt.e.y - offset.top,
      };

      // 转换后的坐标，restorePointerVpt 不受视窗变换的影响
      const pointerVpt = canvas.current.restorePointerVpt(point);
      const dargInfo = JSON.parse(sessionStorage.getItem("dragInfo") as string);
      createElementEvent(dargInfo.type, dargInfo.options, {
        top: pointerVpt.y,
        left: pointerVpt.x,
      });
      sessionStorage.removeItem("dragItem");
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
    events.addListener("switchBrush", switchBrushEvent);
    events.addListener("pathStyleModify", pathStyleModifyEvent);
    events.addListener("exportFile", exportFileEvent);
    events.addListener("newCanvas", newCanvasEvent);

    document.addEventListener("keypress", keypressEvent);
    document.addEventListener("keyup", keyupEvent);

    setTimeout(() => {
      scaleInitEvent();
    }, 100);

    return () => {
      events.removeAllListeners("createElement");
      events.removeAllListeners("deleteElement");
      events.removeAllListeners("setActiveElement");
      events.removeAllListeners("renderElement");
      events.removeAllListeners("updateElementLayout");
      events.removeAllListeners("updateElementPosition");
      events.removeAllListeners("updateCanvas");
      events.removeAllListeners("switchBrush");
      events.removeAllListeners("pathStyleModify");
      events.removeAllListeners("exportFile");
      events.removeAllListeners("newCanvas");
      document.removeEventListener("keypress", keypressEvent);
      document.removeEventListener("keyup", keyupEvent);

      canvas.current.clear();
      canvas.current.dispose();
      canvas.current = null;
    };
  }, []);

  useEffect(() => {
    if (!canvas.current) return;
    canvas.current.on("object:modified", () => {
      saveOperation();
    });
    canvas.current.on("object:added", () => {
      // 退出画笔模式
      const objects = canvas.current.getObjects();

      // 找到 PencilBrush 绘制的路径元素
      const brushPaths = objects.filter(
        (obj: any) =>
          obj instanceof fabric.Path ||
          Object.prototype.hasOwnProperty.call(obj, "_objects")
      );

      // 修改路径元素的 cornerStyle 属性为 'round'
      brushPaths.forEach((path: any) => {
        if (path._data && path._data.id) return;
        const id = getRandomID(10);
        path.set({
          left: path.left + path.width / 2,
          top: path.top + path.height / 2,
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
          _data: {
            id,
            type: brushType,
          },
        });
        initElementProperty(path);
        dispatch(addElement(path.toObject()));
        window.elementMap.set(id, path);
      });

      // 通知 Canvas 更新
      canvas.current.requestRenderAll();

      if (
        sessionStorage.getItem("isOpe") === "false" ||
        !sessionStorage.getItem("isOpe")
      ) {
        saveOperation();
      }
    });
  }, []);

  return (
    <div id="canvas-component" className={style["canvas-component"]}>
      <div className={style["canvas-main"]}>
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
      <ContextMenu
        ref={contextMenuRef}
        menuData={contextMenuData}
        menuClick={(title: string) => menuClick(title, canvas.current)}
      />
    </div>
  );
}

export default memo(Canvas);
