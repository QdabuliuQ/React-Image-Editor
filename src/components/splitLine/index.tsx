import { memo } from "react";

import { Props } from "./type";

import _style from "./index.module.less";

export default memo(function SplitLine({
  className = "",
  style = {},
  ...props
}: Props) {
  return (
    <div className={`${_style.splitLine} ${className}`} style={style}>
      <div className={_style.lineTitle}>{props.title}</div>
    </div>
  );
});
