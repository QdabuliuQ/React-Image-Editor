import { memo } from "react";
import { Tooltip } from "antd";

import style from "./index.module.less";

export default memo(function ContextMenuZIndex() {
  return (
    <div className={style["custom-menu-container"]}>
      <Tooltip placement="top" title="移动到顶层">
        <div className={style["custom-menu-item"]}>
          <i className="iconfont i_top"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="移动到底层">
        <div className={style["custom-menu-item"]}>
          <i className="iconfont i_down"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="上移一层">
        <div className={style["custom-menu-item"]}>
          <i className="iconfont i_to_top"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="下移一层">
        <div className={style["custom-menu-item"]}>
          <i className="iconfont i_to_down"></i>
        </div>
      </Tooltip>
    </div>
  );
});
