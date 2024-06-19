import { useState } from "react";

export default function useCanvasHandle() {
  const [zoom, setZoom] = useState(0);

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

  // 初始化画布

  return {
    scaleDownEvent,
    scaleUpEvent,
    zoom,
    setZoom,
  };
}
