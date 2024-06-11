import { memo, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fabric } from "fabric";

import initAligningGuidelines from "@/libs/guidelines";
import { updateActive } from "@/store/actions/active";
import { initElement } from "@/store/actions/element";

import "./index.less";

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

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#e5e5e5",
      selection: false, // 画布不显示选中
      width: 500,
      height: 700,
      fireRightClick: true, //右键点击事件生效
      stopContextMenu: true, //右键点击禁用默认自带的目录
      fireMiddleClick: true, //中间建点击事件生效
    });
    initAligningGuidelines(canvas);

    const rect = new fabric.Rect({
      left: 100,
      top: 200,
      originX: "left",
      originY: "top",
      width: 150,
      height: 120,
      angle: 180,
      fill: "rgba(255,0,0,0.5)",
      ...options,
      _data: {
        id: "aLKSD0123",
      },
    });
    rect.toObject = (function (toObject) {
      return function (this: any) {
        return fabric.util.object.extend(toObject.call(this), {
          _data: this._data,
        });
      };
    })(rect.toObject);
    canvas.add(rect).setActiveObject(rect);

    rect.on("selected", function (options: any) {
      dispatch(updateActive(options.target._data.id));
    });

    // 监听元素取消选中事件
    rect.on("deselected", function () {
      dispatch(updateActive(""));
    });

    const text = new fabric.Textbox("Lorum ipsum dolor sit amet", {
      left: 50,
      top: 50,
      width: 150,
      fontSize: 20,
      ...options,
      _data: {
        id: "aLKSD0124",
      },
    });
    text.toObject = (function (toObject) {
      return function (this: any) {
        return fabric.util.object.extend(toObject.call(this), {
          _data: this._data,
        });
      };
    })(text.toObject);
    canvas.add(text);

    text.on("selected", function (options: any) {
      console.log(options);

      dispatch(updateActive(options.target._data.id));
    });

    // 监听元素取消选中事件
    text.on("deselected", function () {
      dispatch(updateActive(""));
    });

    dispatch(initElement(canvas.getObjects()));
  }, []);

  return (
    <div className="canvas-component">
      <div className="canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default memo(Canvas);
