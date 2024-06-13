import { memo } from "react";

import OptionItem from "../optionItem";

import { Props } from "./type";

import style from "./index.module.less";

export default memo(function ElementInfo(props: Props) {
  return (
    <>
      <OptionItem title="宽度">
        <span className={style.info}>
          {(props.width * props.scaleX).toFixed(2)}px
        </span>
      </OptionItem>
      <OptionItem title="高度">
        <span className={style.info}>
          {(props.height * props.scaleY).toFixed(2)}px
        </span>
      </OptionItem>
      <OptionItem title="旋转角度">
        <span className={style.info}>{props.angle}deg</span>
      </OptionItem>
      <OptionItem title="偏移X">
        <span className={style.info}>{props.left}px</span>
      </OptionItem>
      <OptionItem title="偏移Y">
        <span className={style.info}>{props.top}px</span>
      </OptionItem>
    </>
  );
});
