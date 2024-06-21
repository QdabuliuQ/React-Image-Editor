import { memo, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Slider, Switch } from "antd";
import { fabric } from "fabric";

import events from "@/bus";
import { updateElementByIdx } from "@/store/actions/element";
import debounce from "@/utils/debounce";

import OptionItem from "../optionItem";

import { Props } from "./type";

import style from "./index.module.less";

interface Params1 {
  title: string;
  effect: string;
  idx: number;
}
interface Params2 {
  title: string;
  effect: string;
  idx: number;
  propName?: string;
  min: number;
  max: number;
  step: number;
  default?: number;
}

let timer1: NodeJS.Timeout, timer2: NodeJS.Timeout, timer3: NodeJS.Timeout;
export default memo(function FilterController({ idx, active }: Props) {
  const dispatch = useDispatch();
  const element = useSelector((state: any) => state.element)[idx];

  // 开关改变回调
  const changeEvent = useCallback(
    debounce((e: boolean, dom: any) => {
      clearTimeout(timer1);
      timer1 = setTimeout(() => {
        const effect = dom.target.parentNode.getAttribute("data-effect");
        const idx = dom.target.parentNode.getAttribute("data-idx");

        element.filters[idx] = e ? new fabric.Image.filters[effect]() : null;
        dispatch(
          updateElementByIdx({
            idx,
            data: JSON.parse(JSON.stringify(element)),
          })
        );

        events.emit("renderElement", {
          key: "filters",
          value: element.filters,
          active,
          applyFilters: true,
        });
      }, 50);
    }),
    []
  );
  const params1 = useMemo<Array<Params1>>(
    () => [
      {
        title: "反转",
        effect: "Invert",
        idx: 1,
      },
      {
        title: "复古",
        effect: "Sepia",
        idx: 3,
      },
      {
        title: "黑白",
        effect: "BlackWhite",
        idx: 19,
      },
      {
        title: "暗色1",
        effect: "Brownie",
        idx: 4,
      },
      {
        title: "暗色2",
        effect: "Vintage",
        idx: 9,
      },
      {
        title: "亮色1",
        effect: "Kodachrome",
        idx: 18,
      },
      {
        title: "亮色2",
        effect: "Technicolor",
        idx: 14,
      },
      {
        title: "亮色3",
        effect: "Polaroid",
        idx: 15,
      },
    ],
    []
  );

  // 开关切换回调
  const switchEvent = useCallback(
    debounce((e: any) => {
      const { checked } = e.target;
      const dom = e.nativeEvent.target;
      const effect = dom.getAttribute("data-effect");
      const idx = dom.getAttribute("data-idx");
      const propName = dom.getAttribute("data-propname");
      const _default = dom.getAttribute("data-default");

      element.filters[idx] = checked
        ? new fabric.Image.filters[effect]({
            [propName ? propName : effect.toLowerCase()]: _default
              ? _default
              : 0,
          })
        : null;
      clearTimeout(timer2);
      timer2 = setTimeout(() => {
        dispatch(
          updateElementByIdx({
            idx,
            data: JSON.parse(JSON.stringify(element)),
          })
        );
        events.emit("renderElement", {
          key: "filters",
          value: element.filters,
          active,
          applyFilters: true,
        });
      }, 50);
    }),
    []
  );

  // 创建一个缓存的回调函数
  const createSliderHandle = useCallback(
    ({ idx, effect, propName }: Params2) =>
      (e: number) => {
        if (!element.filters[idx]) return;
        if (timer3) clearTimeout(timer3);
        timer3 = setTimeout(() => {
          element.filters[idx][propName ? propName : effect.toLowerCase()] = e;
          dispatch(
            updateElementByIdx({
              idx,
              data: JSON.parse(JSON.stringify(element)),
            })
          );
          events.emit("renderElement", {
            key: "filters",
            value: element.filters,
            active,
            applyFilters: true,
          });
        }, 200);
      },
    []
  );

  const params2 = useMemo<Array<Params2>>(
    () => [
      {
        title: "亮度",
        effect: "Brightness",
        idx: 5,
        min: -1,
        max: 1,
        step: 0.1,
      },
      {
        title: "对比度",
        effect: "Contrast",
        idx: 6,
        min: -1,
        max: 1,
        step: 0.1,
      },
      {
        title: "饱和度",
        effect: "Saturation",
        idx: 7,
        min: -1,
        max: 1,
        step: 0.1,
      },
      {
        title: "振动",
        effect: "Vibrance",
        idx: 8,
        min: -1,
        max: 1,
        step: 0.1,
      },
      {
        title: "色调",
        effect: "HueRotation",
        propName: "rotation",
        idx: 21,
        min: -2,
        max: 2,
        step: 0.05,
      },
      {
        title: "噪点",
        effect: "Noise",
        idx: 9,
        min: 0,
        max: 500,
        step: 10,
      },
      {
        title: "像素",
        effect: "Pixelate",
        propName: "blocksize",
        idx: 10,
        min: 2,
        max: 20,
        step: 1,
        default: 4,
      },
      {
        title: "模糊",
        effect: "Blur",
        idx: 11,
        min: 0,
        max: 1,
        step: 0.1,
      },
    ],
    []
  );

  // 使用 useMemo 缓存每个 item 的 onChange 函数
  const sliderHandlers = useMemo(
    () =>
      params2.reduce((acc: any, item: Params2) => {
        acc[item.title] = createSliderHandle(item);
        return acc;
      }, {}),
    [params2, createSliderHandle]
  );

  return (
    <div className={style["filter-controller"]}>
      {params1.map((item: Params1, idx: number) => (
        <OptionItem key={item.title} title={item.title}>
          <Switch
            onChange={changeEvent}
            data-idx={idx}
            data-effect={item.effect}
            defaultChecked={element.filters[1]}
          />
        </OptionItem>
      ))}
      {params2.map((item: Params2) => (
        <OptionItem key={item.title} title={item.title}>
          <div className={style["controller-item"]}>
            <Checkbox
              onChange={switchEvent}
              data-idx={item.idx}
              data-effect={item.effect}
              data-propname={item.propName}
              data-default={item.default}
              defaultChecked={Boolean(element.filters[item.idx])}
            ></Checkbox>
            <Slider
              onChange={sliderHandlers[item.title]}
              disabled={!element.filters[item.idx]}
              defaultValue={
                element.filters[item.idx]
                  ? element.filters[item.idx][
                      item.propName ? item.propName : item.effect.toLowerCase()
                    ]
                  : item.default
                  ? item.default
                  : 0
              }
              step={item.step}
              min={item.min}
              max={item.max}
            />
          </div>
        </OptionItem>
      ))}
    </div>
  );
});
