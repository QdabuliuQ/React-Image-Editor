export default function validateFile(
  file: File,
  type: Array<string> = ["image/png", "image/jpeg", "image/jpg"],
  size: number = 1
) {
  // 检查文件类型
  const allowedTypes = type;
  if (!allowedTypes.includes(file.type)) {
    return {
      status: false,
      msg: "请上传PNG、JPG或JPEG格式的图片！",
    };
  }

  // 检查文件大小，1MB等于1024KB*1024B
  const maxSizeMB = size;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      status: false,
      msg: "文件大小不能超过1MB！",
    };
  }

  // 如果文件类型和大小都符合要求，返回true
  return {
    status: true,
  };
}
