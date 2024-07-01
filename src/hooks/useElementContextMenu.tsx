import { ReactNode, useCallback, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";

import events from "@/bus";
import ContextMenuPosition from "@/components/contextMenuPosition";
import ContextMenuZIndex from "@/components/contextMenuZIndex";
import { updateActive } from "@/store/modules/active/action";
import { addElement } from "@/store/modules/element/action";
import { Canvas } from "@/types/canvas";
import { initElementProperty } from "@/utils/element";
import getRandomID from "@/utils/randomID";

export interface MenuItem {
  title: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export default function useElementContextMenu() {
  const dispatch = useDispatch();

  const offsetX = useRef(0),
    offsetY = useRef(0);
  const elementInfo = useRef<{
    [propName: string]: any;
    _data: {
      type: string;
      id: string;
    };
  }>(null);
  const contextMenuIconStyle = useMemo(
    () => ({
      paddingRight: "10px",
    }),
    []
  );

  const zindexClickEvent = useCallback((type: string) => {
    const _type =
      type === "top"
        ? "bringToFront"
        : type === "bottom"
        ? "sendToBack"
        : type === "one-top"
        ? "bringForward"
        : "sendBackwards";

    events.emit("updateElementLayout", {
      type: _type,
      active: elementInfo.current!._data.id,
    });

    contextMenuRef.current?.hide();
  }, []);

  const positionClickEvent = useCallback((type: string) => {
    if (!elementInfo.current) return;
    events.emit("updateElementPosition", {
      position: type,
      active: elementInfo.current._data.id,
    });
    contextMenuRef.current?.hide();
  }, []);

  const contextMenuRef = useRef<{
    show: (x: number, y: number) => void;
    hide: () => void;
  }>(null);

  const contextMenuData = useMemo(
    () => [
      <ContextMenuZIndex clickEvent={zindexClickEvent} />,
      {
        title: "复制",
        prefix: (
          <i style={contextMenuIconStyle} className="iconfont i_copy"></i>
        ),
      },
      {
        title: "锁定",
        prefix: (
          <i style={contextMenuIconStyle} className="iconfont i_lock"></i>
        ),
      },
      {
        title: "解锁",
        prefix: (
          <i style={contextMenuIconStyle} className="iconfont i_unlock"></i>
        ),
      },
      {
        title: "删除",
        prefix: (
          <i style={contextMenuIconStyle} className="iconfont i_delete"></i>
        ),
      },
      <ContextMenuPosition clickEvent={positionClickEvent} />,
    ],
    []
  );

  const copyElement = useRef<any>(null);

  // 复制
  const copyEvent = (canvas: any) => {
    if (!elementInfo.current) return;
    elementInfo.current.clone(function (obj: any) {
      const id = getRandomID(10);
      obj.set({
        left: obj.left + 10,
        top: obj.top + 10,
        _data: {
          type: obj._data.type,
          id,
        },
        originX: "center",
        originY: "center",
        transparentCorners: false,
        hasControls: true,
        hasBorders: true,
        visible: true,
        cornerStyle: "circle",
        cornerSize: 15,
        borderColor: "#1677ff",
        cornerColor: "#1677ff",
        cornerStrokeColor: "#fff",
      });
      copyElement.current = obj;
      initElementProperty(copyElement.current);
      // 添加到画布
      canvas.add(copyElement.current);
      canvas.setActiveObject(copyElement.current);

      dispatch(addElement(copyElement.current.toObject()));
      dispatch(updateActive(id));
      copyElement.current = null;
    });
  };

  // 锁定/解锁
  const lockEvent = (status: boolean, canvas: any) => {
    if (!elementInfo.current) return;
    elementInfo.current.set({
      selectable: status,
    });
    dispatch(updateActive(""));
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  // 删除
  const deleteEvent = () => {
    if (!elementInfo.current) return;
    events.emit("deleteElement", elementInfo.current._data.id);
  };

  const menuClick = useCallback((title: string, canvas: Canvas) => {
    if (title === "复制") {
      copyEvent(canvas);
    } else if (title === "锁定") {
      lockEvent(false, canvas);
    } else if (title === "解锁") {
      lockEvent(true, canvas);
    } else if (title === "删除") {
      deleteEvent();
    }
    console.log(title);

    (contextMenuRef.current as any).hide();
  }, []);

  return {
    contextMenuRef,
    contextMenuData,
    menuClick,
    elementInfo,
    offsetX,
    offsetY,
  };
}
