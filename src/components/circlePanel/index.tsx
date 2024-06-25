import { memo, useCallback, useMemo } from "react";
import { ColorPicker, InputNumber } from "antd";

import useShadowHandle from "@/hooks/useShadowHandle";
import debounce from "@/utils/debounce";
import panelHandle from "@/utils/panelHandle";

import OptionItem from "../optionItem";
import SplitLine from "../splitLine";

export default memo(function CirclePanel() {
  const brushProperty = useMemo(
    () => ({
      width: 20, // 区域宽度
      color: "#000", // 颜色
      blur: 0,
      offsetX: 0,
      offsetY: 0,
      shadowColor: "#000",
    }),
    []
  );

  const { blurChange, offsetXChange, offsetYChange, shadowColorChange } =
    useShadowHandle(brushProperty);

  const handle1 = useCallback(
    debounce(panelHandle("inputNumber", "width", brushProperty)),
    []
  );
  const handle2 = useCallback(
    debounce(panelHandle("colorPicker", "color", brushProperty)),
    []
  );

  return (
    <>
      <SplitLine title="笔刷属性" />
      <OptionItem title="宽度">
        <InputNumber
          onChange={handle1}
          min={1}
          max={200}
          defaultValue={brushProperty.width}
        />
      </OptionItem>
      <OptionItem title="颜色">
        <ColorPicker onChange={handle2} defaultValue={brushProperty.color} />
      </OptionItem>
      <OptionItem title="阴影模糊">
        <InputNumber
          onChange={blurChange}
          min={0}
          max={50}
          defaultValue={brushProperty.blur}
        />
      </OptionItem>
      <OptionItem title="阴影偏移X">
        <InputNumber
          onChange={offsetXChange}
          min={0}
          max={200}
          defaultValue={brushProperty.offsetX}
        />
      </OptionItem>
      <OptionItem title="阴影偏移Y">
        <InputNumber
          onChange={offsetYChange}
          min={0}
          max={200}
          defaultValue={brushProperty.offsetY}
        />
      </OptionItem>
      <OptionItem title="阴影颜色">
        <ColorPicker
          onChange={shadowColorChange}
          defaultValue={brushProperty.shadowColor}
        />
      </OptionItem>
    </>
  );
});
