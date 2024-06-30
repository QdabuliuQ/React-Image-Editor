import { Canvas } from "@/types/canvas";

// 导出 png 格式的图片
export function exportFileToImage(canvas: Canvas, type: "png" | "jpg") {
  const { width, height } = JSON.parse(
    sessionStorage.getItem("canvasInfo") as string
  );
  canvas.setViewportTransform && canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  const dataUrl = canvas.toDataURL && canvas.toDataURL({
    format: "png",
    quality: 1,
    width,
    height,
  });
  canvas.setViewportTransform && canvas.setViewportTransform(
    JSON.parse(sessionStorage.getItem("viewportTransform") as string)
  );
  const a = document.createElement("a");
  a.href = dataUrl as string;
  a.download = Date.now() + "." + type;
  a.click();
}

// 导出 svg 格式的图片
export function exportFileToSvg(canvas: Canvas) {
  const { width, height } = JSON.parse(
    sessionStorage.getItem("canvasInfo") as string
  );
  const svg = canvas.toSVG && canvas.toSVG({
    width,
    height,
    viewBox: {
      x: 0,
      y: 0,
      width,
      height,
    },
  });
  const blob = new Blob([svg as BlobPart], { type: "image/svg+xml;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = Date.now() + ".svg";
  link.click();
}

// 导出json格式文件
export function exportFileJson(canvas: Canvas) {
  const objects = canvas.getObjects(); // 获取 Canvas 上的所有对象

  // 将 Fabric.js 对象转换为普通 JavaScript 对象
  const dataToExport = objects.map(function (obj: { toObject: () => Object }) {
    return obj.toObject();
  });

  // 将 JavaScript 对象转换为 JSON 字符串
  const jsonString = JSON.stringify(dataToExport, null, 2);

  const url = URL.createObjectURL(new Blob([jsonString], { type: "application/json" }));
  const link = document.createElement("a")
  link.href = url
  link.download = Date.now() + ".json"
  link.click()
}