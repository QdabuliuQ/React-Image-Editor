import { memo } from "react";

import { Props } from "./type";

import "./index.less";

export default memo(function OptionItem(props: Props) {
  return (
    <div className="option-item">
      <div className="item-title">{props.title}</div>
      <div className="item-component">{props.children}</div>
    </div>
  );
});
