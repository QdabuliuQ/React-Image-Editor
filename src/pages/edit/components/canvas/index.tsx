import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fabric } from "fabric";

import events from "@/bus";
import initAligningGuidelines from "@/libs/guidelines";
import { updateActive } from "@/store/actions/active";
import {
  addElement,
  deleteElementByIdx,
  updateElementByIdx,
} from "@/store/actions/element";
import * as createMethods from "@/utils/element";

import "./index.less";

const elementMap = new Map();
let canvas: any;
function Canvas() {
  const dispatch = useDispatch();
  const elements = useSelector((state: any) => state.element);
  const active = useSelector((state: any) => state.active);
  const [customActive, setCustomActive] = useState("");

  const deleteElementEvent = (id: string) => {
    for (let i = 0; i < elements.length; i++) {
      if (elements[i]._data.id === id) {
        dispatch(deleteElementByIdx(i));
        break;
      }
    }
  };

  useEffect(() => {
    setCustomActive(active);
    if (canvas) {
      setTimeout(() => {
        console.log(canvas);

        // canvas.loadFromJSON(
        //   JSON.stringify({
        //     background: "#e5e5e5",
        //     objects: elements,
        //   }),
        //   canvas.renderAll.bind(canvas)
        // );
      }, 1000);
    }

    // if (canvas && elements) {
    //   canvas.loadFromJSON(elements);
    // }
  }, [elements, active]);

  const createElementEvent = (type: string) => {
    const element = (createMethods as any)[`create${type}Element`]();
    elementMap.set(element._data.id, element);
    dispatch(addElement(element.toObject()));
    canvas.add(element);
    canvas.setActiveObject(element);
  };

  const setActiveElementEvent = (id: string) => {
    dispatch(updateActive(id));
  };

  const renderElementEvent = (elements: Array<Element>) => {
    canvas.loadFromJSON(
      JSON.stringify({
        background: "#e5e5e5",
        objects: elements,
      })
    );
  };

  const modifiedElementEvent = (config: any) => {
    console.log(customActive);

    if (customActive) {
      for (let i = 0; i < elements.length; i++) {
        if (elements[i]._data.id === customActive) {
          dispatch(
            updateElementByIdx({
              idx: i,
              data: config,
            })
          );
          break;
        }
      }
    }
  };

  useEffect(() => {
    console.log(elements);

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
    events.addListener("modifiedElement", modifiedElementEvent);

    return () => {
      events.removeAllListeners("createElement");
      events.removeAllListeners("deleteElement");
      events.removeAllListeners("setActiveElement");
      events.removeAllListeners("renderElement");
      events.removeAllListeners("modifiedElement");

      canvas.dispose();
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
