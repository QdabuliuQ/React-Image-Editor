import { useState } from "react";
import { useDispatch } from "react-redux";

import { updateActive } from "@/store/modules/active/action";
import { initElement } from "@/store/modules/element/action";
import { clearOperationRedoStack } from "@/store/modules/redoStack/action";
import { clearOperationUndoStack } from "@/store/modules/undoStack/actions";

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
  // const clearEvent = (elementMap: Map<string, any>) => {
  const clearEvent = () => {
    for (const [, value] of window.elementMap) {
      window._instance.remove(value);
    }
    dispatch(updateActive(""));
    dispatch(initElement([]));
    dispatch(clearOperationRedoStack())
    dispatch(clearOperationUndoStack())
    window.elementMap.clear();
    window._instance.renderAll();
  };

  return {
    scaleDownEvent,
    scaleUpEvent,
    zoom,
    setZoom,
    clearEvent,
  };
}
