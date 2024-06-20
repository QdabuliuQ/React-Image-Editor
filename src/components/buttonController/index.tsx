import { memo, useCallback, useState } from "react";
import { Modal, Tooltip } from "antd";

import { Props } from "./type";

import style from "./index.module.less";

export default memo(function ScaleController(props: Props) {
  const [isShow, setIsShow] = useState(false);
  // 打开弹窗
  const clearClick = useCallback(() => {
    setIsShow(true);
  }, []);
  // 清空画布
  const confirmEvent = useCallback(() => {
    setIsShow(false);
    props.clearEvent();
  }, []);

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
        <div onClick={clearClick} className={`${style["button-item"]}`}>
          <i className="iconfont i_clear"></i>
        </div>
      </Tooltip>
      <Modal
        title="提示"
        centered
        open={isShow}
        onOk={confirmEvent}
        okText="确定"
        cancelText="取消"
      >
        <span>是否确定清空画布?</span>
      </Modal>
    </div>
  );
});
