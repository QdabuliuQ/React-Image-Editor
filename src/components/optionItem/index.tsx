import { memo } from "react";

import { Props } from "./type";

import style from "./index.module.less";

export default memo(function OptionItem(props: Props) {
  return (
    <div className={style["option-item"]}>
      <div className={style["item-title"]}>{props.title}</div>
      <div className={style["item-component"]}>{props.children}</div>
    </div>
  );
});
