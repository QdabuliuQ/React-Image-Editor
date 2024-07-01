import { memo, useCallback } from "react";
import { Tooltip } from "antd";

import { Props } from "./type";

import style from "./index.module.less";

export default memo(function ContextMenuPosition(props: Props) {
  const clickEvent = (type: string) => {
    return () => props.clickEvent(type);
  };
  const handle1 = useCallback(clickEvent("align-left"), []);
  const handle2 = useCallback(clickEvent("align-center"), []);
  const handle3 = useCallback(clickEvent("align-right"), []);
  const handle4 = useCallback(clickEvent("align-justify"), []);
  const handle5 = useCallback(clickEvent("align-top"), []);
  const handle6 = useCallback(clickEvent("align-vertically"), []);
  const handle7 = useCallback(clickEvent("align-bottom"), []);

  return (
    <div className={style["custom-menu-container"]}>
      <Tooltip placement="top" title="水平居左">
        <div onClick={handle1} className={style["custom-menu-item"]}>
          <i className="iconfont i_align-left"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="水平居中">
        <div onClick={handle2} className={style["custom-menu-item"]}>
          <i className="iconfont i_align-center"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="水平居右">
        <div onClick={handle3} className={style["custom-menu-item"]}>
          <i className="iconfont i_align-right"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="垂直水平居中">
        <div onClick={handle4} className={style["custom-menu-item"]}>
          <i className="iconfont i_align-justify"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="垂直居上">
        <div onClick={handle5} className={style["custom-menu-item"]}>
          <i className="iconfont i_align-top"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="垂直居中">
        <div onClick={handle6} className={style["custom-menu-item"]}>
          <i className="iconfont i_align-vertically"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="垂直居下">
        <div onClick={handle7} className={style["custom-menu-item"]}>
          <i className="iconfont i_align-bottom"></i>
        </div>
      </Tooltip>
    </div>
  );
});
