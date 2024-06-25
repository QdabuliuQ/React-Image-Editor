import { useCallback } from "react";

import shadowHandle from "@/utils/shadowHandle";

// 阴影配置回调函数 hook
export default function useShadowHandle(brushProperty: any) {
  const shadow = {
    blur: brushProperty.blur, // 羽化程度
    offsetX: brushProperty.offsetX, // x轴偏移量
    offsetY: brushProperty.offsetY, // y轴偏移量
    color: brushProperty.shadowColor, // 投影颜色
  };

  const blurChange = useCallback(
    shadowHandle(shadow, "blur", "inputNumber"),
    []
  );
  const offsetXChange = useCallback(
    shadowHandle(shadow, "offsetX", "inputNumber"),
    []
  );
  const offsetYChange = useCallback(
    shadowHandle(shadow, "offsetY", "inputNumber"),
    []
  );
  const shadowColorChange = useCallback(
    shadowHandle(shadow, "color", "colorPicker"),
    []
  );

  return {
    blurChange,
    offsetXChange,
    offsetYChange,
    shadowColorChange,
    shadow,
  };
}
