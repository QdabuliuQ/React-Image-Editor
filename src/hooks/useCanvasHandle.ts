import { useState } from "react";
import { useDispatch } from "react-redux";

import { updateActive } from "@/store/actions/active";
import { initElement } from "@/store/actions/element";

export default function useCanvasHandle() {
  const [zoom, setZoom] = useState(0);
  const dispatch = useDispatch();

  // 缩小回调
  const scaleDownEvent = (canvas: any) => {
    const _zoom = zoom - 0.2 > 0.1 ? zoom - 0.2 : 0.1;
    setZoom(_zoom);
    canvas.zoomToPoint(
      {
        // 关键点
        x: canvas.width / 2,
        y: canvas.height / 2,
      },
      _zoom // 传入修改后的缩放级别
    );
  };

  // 放大回调
  const scaleUpEvent = (canvas: any) => {
    const _zoom = zoom + 0.2 < 8 ? zoom + 0.2 : 8;
    setZoom(_zoom);
    canvas.zoomToPoint(
      {
        // 关键点
        x: canvas.width / 2,
        y: canvas.height / 2,
      },
      _zoom // 传入修改后的缩放级别
    );
  };

  // 清空画布
  const clearEvent = (canvas: any, elementMap: Map<string, any>) => {
    console.log(elementMap);

    for (const [, value] of elementMap) {
      console.log(canvas.remove(value), "map");
    }
    dispatch(updateActive(""));
    dispatch(initElement([]));
    elementMap.clear();
    canvas.renderAll();
    console.log(canvas.getObjects());
  };

  return {
    scaleDownEvent,
    scaleUpEvent,
    zoom,
    setZoom,
    clearEvent,
  };
}
