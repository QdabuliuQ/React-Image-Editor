import { memo, useCallback } from "react";
import { Tooltip } from "antd";

import { Props } from "./type";

import style from "./index.module.less";

export default memo(function ContextMenuZIndex(props: Props) {
  const clickEvent = (type: string) => {
    return () => props.clickEvent(type);
  };
  const handle1 = useCallback(clickEvent("top"), []);
  const handle2 = useCallback(clickEvent("bottom"), []);
  const handle3 = useCallback(clickEvent("one-top"), []);
  const handle4 = useCallback(clickEvent("one-bottom"), []);

  return (
    <div className={style["custom-menu-container"]}>
      <Tooltip placement="top" title="移动到顶层">
        <div onClick={handle1} className={style["custom-menu-item"]}>
          <i className="iconfont i_top"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="移动到底层">
        <div onClick={handle2} className={style["custom-menu-item"]}>
          <i className="iconfont i_down"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="上移一层">
        <div onClick={handle3} className={style["custom-menu-item"]}>
          <i className="iconfont i_to_top"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="下移一层">
        <div onClick={handle4} className={style["custom-menu-item"]}>
          <i className="iconfont i_to_down"></i>
        </div>
      </Tooltip>
    </div>
  );
});
