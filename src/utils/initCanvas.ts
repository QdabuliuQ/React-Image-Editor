import { fabric } from "fabric";

export default function initCanvas(
  canvas: any,
  sketch: any,
  zoomLevel: number
) {
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
}
