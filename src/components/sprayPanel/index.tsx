import { memo, useCallback, useMemo } from "react";
import { ColorPicker, InputNumber, Switch } from "antd";

import debounce from "@/utils/debounce";
import panelHandle from "@/utils/panelHandle";

import OptionItem from "../optionItem";
import SplitLine from "../splitLine";

export default memo(function SprayPanel() {
  const brushProperty = useMemo(
    () => ({
      width: 10, // 区域宽度
      density: 20, // 密度
      dotWidth: 1, // 点宽度
      randomOpacity: true, // 随机透明
      optimizeOverlapping: false, // 重叠优化
      color: "#000", // 颜色
    }),
    []
  );

  const handle1 = useCallback(
    debounce(panelHandle("inputNumber", "width", brushProperty)),
    []
  );
  const handle2 = useCallback(
    debounce(panelHandle("inputNumber", "density", brushProperty)),
    []
  );
  const handle3 = useCallback(
    debounce(panelHandle("inputNumber", "dotWidth", brushProperty)),
    []
  );
  const handle4 = useCallback(
    debounce(panelHandle("switch", "randomOpacity", brushProperty)),
    []
  );
  const handle5 = useCallback(
    debounce(panelHandle("switch", "optimizeOverlapping", brushProperty)),
    []
  );
  const handle6 = useCallback(
    debounce(panelHandle("colorPicker", "color", brushProperty)),
    []
  );

  return (
    <>
      <SplitLine title="笔刷属性" />
      <OptionItem title="笔刷宽度">
        <InputNumber
          onChange={handle1}
          min={1}
          max={200}
          defaultValue={brushProperty.width}
        />
      </OptionItem>
      <OptionItem title="点密度">
        <InputNumber
          onChange={handle2}
          min={1}
          max={200}
          defaultValue={brushProperty.density}
        />
      </OptionItem>
      <OptionItem title="点宽度">
        <InputNumber
          onChange={handle3}
          min={1}
          max={100}
          defaultValue={brushProperty.dotWidth}
        />
      </OptionItem>
      <OptionItem title="随机透明">
        <Switch
          onChange={handle4}
          defaultChecked={brushProperty.randomOpacity}
        />
      </OptionItem>
      <OptionItem title="启动重叠优化">
        <Switch
          onChange={handle5}
          defaultChecked={brushProperty.optimizeOverlapping}
        />
      </OptionItem>
      <OptionItem title="颜色">
        <ColorPicker onChange={handle6} defaultValue={brushProperty.color} />
      </OptionItem>
    </>
  );
});
