import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, ColorPicker, InputNumber, Modal, Tooltip } from "antd";

import events from "@/bus";
import debounce from "@/utils/debounce";
// import { getNextOperation, getPrevOperation } from "@/utils/opeHistory";

import style from "./index.module.less";
import useOpeHistory from "@/hooks/useOpeHistory";
import { clearOperationRedoStack } from "@/store/modules/redoStack/action";
import { clearOperationUndoStack } from "@/store/modules/undoStack/actions";

export default memo(function Header() {
  const dispatch = useDispatch();
  const { getNextOperation, getPrevOperation, redoStack, undoStack } =
    useOpeHistory();

  const active = useSelector((state: any) => state.active);
  const mode = useRef("");

  const prevClickEvent = useCallback(() => {
    sessionStorage.setItem("isOpe", "true");
    getPrevOperation();
    setTimeout(() => {
      sessionStorage.removeItem("isOpe");
    }, 100);
  }, [undoStack, redoStack]);
  const nextClickEvent = useCallback(() => {
    sessionStorage.setItem("isOpe", "true");
    getNextOperation();
    setTimeout(() => {
      sessionStorage.removeItem("isOpe");
    }, 100);
  }, [undoStack, redoStack]);

  // const elementChange = () => {
  //   if (disable1) {
  //     setDisable1(false);
  //   }
  // };

  const [open, setOpen] = useState(false);
  const newCanvasEvent = useCallback(() => {
    setOpen(true);
  }, []);
  const handleOk = useCallback(() => {
    events.emit("updateCanvas", {
      key: "width",
      value: Number((widthRef.current as any).value),
    });
    events.emit("updateCanvas", {
      key: "height",
      value: Number((heightRef.current as any).value),
    });
    events.emit("updateCanvas", {
      key: "fill",
      value: color.current,
    });

    dispatch(clearOperationRedoStack());
    dispatch(clearOperationUndoStack());
  }, []);
  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const widthRef = useRef(null),
    heightRef = useRef(null);
  const color = useRef("#fff");
  const reg = useMemo(() => /.*Brush/, []);

  const colorChange = useCallback(
    debounce((_: unknown, e: string) => {
      color.current = e;
    }, 100),
    []
  );

  // useEffect(() => {
  //   events.on("elementChange", elementChange);
  //   return () => {
  //     events.removeAllListeners("elementChange");
  //   };
  // }, []);
  useEffect(() => {
    mode.current = active;
  }, [active]);

  return (
    <div className={style["edit-header"]}>
      <Modal
        okText="确定"
        cancelText="取消"
        title="提示"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <div className={style["canvas-form"]}>
          <div className={style["form-item"]}>
            宽度：
            <InputNumber ref={widthRef} min={50} max={5000} defaultValue={50} />
          </div>
          <div className={style["form-item"]}>
            高度：
            <InputNumber
              ref={heightRef}
              min={50}
              max={5000}
              defaultValue={50}
            />
          </div>
          <div className={style["form-item"]}>
            背景颜色：
            <ColorPicker onChange={colorChange} defaultValue="#fff" />
          </div>
        </div>
        <p className={style["tip"]}>新建画布将会覆盖原画布的内容</p>
      </Modal>
      <div className={`${style["header-left"]} ${style["header-item"]}`}>
        <Button
          disabled={reg.test(active)}
          onClick={newCanvasEvent}
          type="text"
        >
          新建
        </Button>
        <Button type="text">保存</Button>
      </div>
      <div className={`${style["header-center"]} ${style["header-item"]}`}>
        <Tooltip placement="bottom" title="撤销">
          <Button
            onClick={prevClickEvent}
            type="text"
            shape="circle"
            disabled={undoStack.length === 0}
            icon={<i className="iconfont i_pre"></i>}
          />
        </Tooltip>
        <Tooltip placement="bottom" title="重做">
          <Button
            onClick={nextClickEvent}
            type="text"
            shape="circle"
            disabled={redoStack.length === 0}
            icon={<i className="iconfont i_next"></i>}
          />
        </Tooltip>
      </div>
      <div className={`${style["header-right"]} ${style["header-item"]}`}>
        <Button type="text">新建</Button>
      </div>
    </div>
  );
});
