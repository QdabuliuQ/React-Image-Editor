import { memo } from "react";
import { Tooltip } from "antd";

import { Props } from "./type";

import style from "./index.module.less";

export default memo(function ScaleController(props: Props) {
  return (
    <div className={style["button-controller"]}>
      <Tooltip placement="top" title="缩小">
        <div
          onClick={props.scaleDownEvent}
          className={`${style["scale-button"]} ${style["button-item"]}`}
        >
          <i className="iconfont i_scale_down"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="放大">
        <div
          onClick={props.scaleUpEvent}
          className={`${style["scale-button"]} ${style["button-item"]}`}
        >
          <i className="iconfont i_scale_up"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="定位画布">
        <div
          onClick={props.scaleInitEvent}
          className={`${style["button-item"]}`}
        >
          <i className="iconfont i_init"></i>
        </div>
      </Tooltip>
      <Tooltip placement="top" title="清空画布">
        <div className={`${style["button-item"]}`}>
          <i className="iconfont i_clear"></i>
        </div>
      </Tooltip>
    </div>
  );
});
