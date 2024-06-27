// 导出 png 格式的图片
export function exportFileToPng(canvas: any) {
  const { width, height } = JSON.parse(
    sessionStorage.getItem("canvasInfo") as string
  );
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  const dataUrl = canvas.toDataURL({
    format: "png",
    quality: 1,
    width,
    height,
  });
  canvas.setViewportTransform(
    JSON.parse(sessionStorage.getItem("viewportTransform") as string)
  );
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = Date.now() + ".png";
  a.click();
}

// 导出 svg 格式的图片
export function exportFileToSvg(canvas: any) {
  const { width, height } = JSON.parse(
    sessionStorage.getItem("canvasInfo") as string
  );
  const svg = canvas.toSVG({
    width,
    height,
    viewBox: {
      x: 0,
      y: 0,
      width,
      height,
    },
  });
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = Date.now() + ".svg";
  link.click();
}
