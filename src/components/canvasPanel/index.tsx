import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ColorPicker, InputNumber } from "antd";

import events from "@/bus";
import SplitLine from "@/components/splitLine";
import { updateCanvas } from "@/store/actions/canvas";
import debounce from "@/utils/debounce";

import OptionItem from "../optionItem";

import style from "./index.module.less";

export default memo(function CanvasPanel() {
  const canvas = useSelector((state: any) => state.canvas);
  const dispatch = useDispatch();

  const inputHandle = (key: string) => {
    return (e: number) => {
      dispatch(
        updateCanvas({
          key,
          value: e,
        })
      );
      events.emit("updateCanvas", {
        key,
        value: e,
      });
    };
  };
  const widthChange = useCallback(debounce(inputHandle("width")), []);
  const heightChange = useCallback(debounce(inputHandle("height")), []);

  return (
    <div className={style["canvas-panel"]}>
      <SplitLine title="画布配置" />
      <OptionItem title="画布宽度">
        <InputNumber
          onChange={widthChange}
          defaultValue={canvas.width}
          min={1}
          max={10000}
        />
      </OptionItem>
      <OptionItem title="画布高度">
        <InputNumber
          onChange={heightChange}
          defaultValue={canvas.height}
          min={1}
          max={10000}
        />
      </OptionItem>
      <OptionItem title="画布颜色">
        <ColorPicker defaultValue={canvas.fill} />
      </OptionItem>
    </div>
  );
});