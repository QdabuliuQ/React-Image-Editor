import { memo, useCallback } from "react";
import { ColorPicker, InputNumber, Select, Switch } from "antd";

import events from "@/bus";
import useShadowHandle from "@/hooks/useShadowHandle";
import debounce from "@/utils/debounce";
import panelHandle from "@/utils/panelHandle";

import OptionItem from "../optionItem";
import SplitLine from "../splitLine";

import style from "./index.module.less";

export default memo(function PencilPanel() {
  const brushProperty = {
    width: 1,
    color: "#000",
    dash: false,
    blur: 0,
    offsetX: 0,
    offsetY: 0,
    shadowColor: "#000",
    strokeLineCap: "round",
  };

  const handle1 = useCallback(
    debounce(panelHandle("inputNumber", "width", brushProperty)),
    []
  );
  const handle2 = useCallback(
    debounce(panelHandle("colorPicker", "color", brushProperty)),
    []
  );
  const handle3 = useCallback(
    debounce(panelHandle("select", "strokeLineCap", brushProperty)),
    []
  );
  const dashChange = useCallback(
    debounce((e: boolean) => {
      events.emit("pathStyleModify", {
        key: "strokeDashArray",
        value: e ? [10, 20] : null,
      });
      (brushProperty as any)["dash"] = e;
    }),
    []
  );

  const { blurChange, offsetXChange, offsetYChange, shadowColorChange } =
    useShadowHandle(brushProperty);

  return (
    <div className={style["pencil-panel"]}>
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
      <OptionItem title="虚线">
        <Switch onChange={dashChange} defaultChecked={brushProperty.dash} />
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
      <OptionItem title="画笔风格">
        <Select
          onChange={handle3}
          defaultValue={brushProperty.strokeLineCap}
          options={[
            { value: "round", label: "圆角" },
            { value: "square", label: "方形" },
          ]}
        />
      </OptionItem>
    </div>
  );
});
