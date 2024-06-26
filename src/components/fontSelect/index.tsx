import { memo, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message, Select, Spin } from "antd";
import FontFaceObserver from "fontfaceobserver";

import events from "@/bus";
import fontFamily from "@/libs/fontFamily";
import { updateElementByIdx } from "@/store/modules/element/action";

import OptionItem from "../optionItem";

import { Props } from "./type";

import style from "./index.module.less";

export default memo(function FontSelect(props: Props) {
  const [messageApi, contextHolder] = message.useMessage();
  const [spinning, setSpinning] = useState(false);
  const dispatch = useDispatch();
  const element = useSelector((state: any) => state.element)[props.idx];
  const fontFamilyList = useMemo(
    () => [
      {
        value: "Times New Roman",
        label: "Times New Roman",
      },
      {
        value: "阿里妈妈刀隶体",
        label: "阿里妈妈刀隶体",
      },
      {
        value: "阿里妈妈方圆体",
        label: "阿里妈妈方圆体",
      },
      {
        value: "得意黑",
        label: "得意黑",
      },
      {
        value: "阿里妈妈东方大楷",
        label: "阿里妈妈东方大楷",
      },
      {
        value: "钉钉进步体",
        label: "钉钉进步体",
      },
      {
        value: "阿里妈妈数黑体",
        label: "阿里妈妈数黑体",
      },
      {
        value: "思源黑体",
        label: "思源黑体",
      },
      {
        value: "阿里巴巴普惠体",
        label: "阿里巴巴普惠体",
      },
      {
        value: "站酷仓耳渔阳体",
        label: "站酷仓耳渔阳体",
      },
    ],
    []
  );

  const getFontFamilyData = (type: string) => {
    return new Promise<void>((resolve, reject) => {
      const style = document.createElement("style");
      style.textContent = (fontFamily as any)[type];
      document.head.appendChild(style);
      if (type !== "Times New Roman") {
        // 监听字体加载完毕
        const font = new FontFaceObserver(type);
        font.load(null, 60000).then(resolve).catch(reject);
      } else {
        resolve();
      }
    });
  };

  const onFontChange = useCallback((value: string) => {
    setSpinning(true);
    getFontFamilyData(value)
      .then(() => {
        element["fontFamily"] = value;
        dispatch(
          updateElementByIdx({
            idx: props.idx,
            data: JSON.parse(JSON.stringify(element)),
          })
        );

        events.emit("renderElement", {
          key: "fontFamily",
          value,
          active: props.active,
        });
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "字体加载失败，请重试",
        });
      })
      .finally(() => {
        setSpinning(false);
      });
  }, []);

  return (
    <div className={style["font-select"]}>
      {contextHolder}
      <Spin tip="正在加载字体..." size="large" spinning={spinning} fullscreen />
      <OptionItem title="字体">
        <Select
          onChange={onFontChange}
          defaultValue={props.fontFamily}
          options={fontFamilyList}
        />
      </OptionItem>
    </div>
  );
});
