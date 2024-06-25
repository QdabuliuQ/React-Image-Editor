import { memo } from "react";
import { Tooltip } from "antd";

import { Props } from "./type";

import style from "./index.module.less";

export default memo(function ContextMenuPosition(props: Props) {
  return (
    <div className={style["custom-menu-container"]}>
      <Tooltip placement="top" title="水平居左">
        <div
          onClick={() => props.clickEvent("align-left")}
          className={style["custom-menu-item"]}
        >
          <i className="iconfont i_align-left"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="水平居中">
        <div
          onClick={() => props.clickEvent("align-center")}
          className={style["custom-menu-item"]}
        >
          <i className="iconfont i_align-center"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="水平居右">
        <div
          onClick={() => props.clickEvent("align-right")}
          className={style["custom-menu-item"]}
        >
          <i className="iconfont i_align-right"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="垂直水平居中">
        <div
          onClick={() => props.clickEvent("align-justify")}
          className={style["custom-menu-item"]}
        >
          <i className="iconfont i_align-justify"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="垂直居上">
        <div
          onClick={() => props.clickEvent("align-top")}
          className={style["custom-menu-item"]}
        >
          <i className="iconfont i_align-top"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="垂直居中">
        <div
          onClick={() => props.clickEvent("align-vertically")}
          className={style["custom-menu-item"]}
        >
          <i className="iconfont i_align-vertically"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="垂直居下">
        <div
          onClick={() => props.clickEvent("align-bottom")}
          className={style["custom-menu-item"]}
        >
          <i className="iconfont i_align-bottom"></i>
        </div>
      </Tooltip>
    </div>
  );
});
