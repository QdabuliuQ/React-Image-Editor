// 导出 png 格式的图片
export function exportFileToPng(canvas: any) {

  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  const dataUrl = canvas.toDataURL({
    format: "png",
    quality: 1,
    width: 500,
    height: 600,
  });

  const a = document.createElement("a")
  a.href = dataUrl
  a.download = Date.now() + '.png'
  a.click()
}

// 导出 svg 格式的图片
export function exportFileToSvg(canvas: any) {
  const svg = canvas.toSVG();
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = Date.now() + ".svg";
  link.click();
}
