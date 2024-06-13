import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Tooltip } from "antd";

import events from "@/bus/index";
import ColorPicker from "@/components/colorPicker";
import ElementInfo from "@/components/elementInfo";
import InputNumber from "@/components/inputNumber";
import OptionItem from "@/components/optionItem";
import Select from "@/components/select";
import Slider from "@/components/slider";
import SplitLine from "@/components/splitLine";
import Switch from "@/components/switch";
import { useActiveIdx } from "@/hooks/useActiveIdx";
import { updateActive } from "@/store/actions/active";
import {
  deleteElementByIdx,
  updateElementByIdx,
} from "@/store/actions/element";
import { getConfig } from "@/utils/getConfig";

import style from "./index.module.less";

export default memo(function Panel() {
  const [idx, active, element, elements] = useActiveIdx();
  const [config, setConfig] = useState(null);

  const fetchConfig = async () => {
    const res = await getConfig(element._data.type);
    setConfig(res);
  };

  useEffect(() => {
    if (idx != -1) {
      fetchConfig();
    } else {
      setConfig(null);
    }
  }, [idx]);

  const getIdx = () => {
    for (let i = 0; i < elements.length; i++) {
      if (elements[i]._data.id === active) {
        return i;
      }
    }
    return -1;
  };

  const dispatch = useDispatch();
  const modifiedElementEvent = (config: any) => {
    if (active) {
      const idx = getIdx();
      if (idx === -1) return;
      dispatch(
        updateElementByIdx({
          idx,
          data: config,
        })
      );
    }
  };

  useEffect(() => {
    events.addListener("modifiedElement", modifiedElementEvent);

    return () => {
      events.removeAllListeners("modifiedElement");
    };
  }, [active]);

  const deleteEvent = useCallback(() => {
    if (active) {
      const idx = getIdx();
      if (idx === -1) return;
      events.emit("deleteElement", active);
      dispatch(deleteElementByIdx(idx));
      dispatch(updateActive(""));
    }
  }, [active]);

  const visibleEvent = useCallback(() => {
    if (active) {
      const idx = getIdx();
      if (idx === -1) return;
      elements[idx].visible = !elements[idx].visible;
      dispatch(
        updateElementByIdx({
          idx,
          data: JSON.parse(JSON.stringify(elements[idx])),
        })
      );
      events.emit("renderElement", {
        key: "visible",
        value: elements[idx].visible,
        active,
      });
    }
  }, [active]);

  const topClickEvent = useCallback(() => {
    events.emit("updateElementLayout", {
      type: "bringToFront",
      active,
    });
  }, [active]);
  const downClickEvent = useCallback(() => {
    events.emit("updateElementLayout", {
      type: "sendToBack",
      active,
    });
  }, [active]);
  const toTopClickEvent = useCallback(() => {
    events.emit("updateElementLayout", {
      type: "bringForward",
      active,
    });
  }, [active]);
  const toDownClickEvent = useCallback(() => {
    events.emit("updateElementLayout", {
      type: "sendBackwards",
      active,
    });
  }, [active]);

  return (
    <div className={style["panel-component"]}>
      <div key={idx} className={style["panel-container"]}>
        {idx == -1 || !config || !elements[idx] ? (
          <div>common</div>
        ) : (
          <>
            <SplitLine title="基础属性" />
            <ElementInfo
              width={elements[idx].width}
              height={elements[idx].height}
              scaleX={elements[idx].scaleX}
              scaleY={elements[idx].scaleY}
              angle={elements[idx].angle}
              left={elements[idx].left}
              top={elements[idx].top}
            />
            <SplitLine title="自定义属性" />
            {(config as unknown as Array<any>).map((item: any) => (
              <OptionItem key={item.title} title={item.title}>
                {item.type === "inputNumber" ? (
                  <InputNumber
                    {...item}
                    idx={idx}
                    active={active}
                    defaultValue={element[item.name]}
                  />
                ) : item.type === "colorPicker" ? (
                  <ColorPicker
                    {...item}
                    idx={idx}
                    active={active}
                    defaultValue={element[item.name]}
                  />
                ) : item.type === "select" ? (
                  <Select
                    {...item}
                    idx={idx}
                    active={active}
                    defaultValue={element[item.name]}
                  />
                ) : item.type === "switch" ? (
                  <Switch
                    {...item}
                    idx={idx}
                    active={active}
                    defaultValue={element[item.name]}
                  />
                ) : item.type === "slider" ? (
                  <Slider
                    {...item}
                    idx={idx}
                    active={active}
                    defaultValue={element[item.name]}
                  />
                ) : (
                  <></>
                )}
              </OptionItem>
            ))}
            <Button.Group className={style["group-button"]}>
              <Tooltip placement="top" title="移动到顶层">
                <Button
                  onClick={topClickEvent}
                  className={style["group-button-item"]}
                  icon={<i className="iconfont i_top"></i>}
                />
              </Tooltip>
              <Tooltip placement="top" title="移动到底层">
                <Button
                  onClick={downClickEvent}
                  className={style["group-button-item"]}
                  icon={<i className="iconfont i_down"></i>}
                />
              </Tooltip>
              <Tooltip placement="top" title="上移一层">
                <Button
                  onClick={toTopClickEvent}
                  className={style["group-button-item"]}
                  icon={<i className="iconfont i_to_top"></i>}
                />
              </Tooltip>
              <Tooltip placement="top" title="下移一层">
                <Button
                  onClick={toDownClickEvent}
                  className={style["group-button-item"]}
                  icon={<i className="iconfont i_to_down"></i>}
                />
              </Tooltip>
            </Button.Group>
            <Button block={true} type="primary" danger onClick={deleteEvent}>
              删除元素
            </Button>
            <Button
              style={{
                marginTop: "15px",
              }}
              onClick={visibleEvent}
              block={true}
              type="primary"
            >
              {elements[idx].visible ? "隐藏元素" : "显示元素"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
});
