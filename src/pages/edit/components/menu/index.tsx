import { memo, useCallback, useMemo, useState } from "react";
import { Collapse, message } from "antd";

import circlePreview from "@/assets/image/circle-preview.png";
import rectPreview from "@/assets/image/rect-preview.png";
import textPreview from "@/assets/image/text-preview.png";
import trianglePreview from "@/assets/image/triangle-preview.png";
import { SHAPE_LIST } from "@/assets/js/shape";
import events from "@/bus";
import ImageUpload from "@/components/imageUpload";
import SplitLine from "@/components/splitLine";
import { ShapeItem } from "@/types/shape";

import { MenuItem } from "./type";

import style from "./index.module.less";
let previewDom: HTMLDivElement | null = null;
let lastX: number = 0,
  lastY: number = 0;
function Menu() {
  const [mode, setMode] = useState("default");
  const [messageApi, contextHolder] = message.useMessage();

  const menus = useMemo(
    () => [
      {
        type: "Text",
        icon: "i_text",
        title: "文本",
      },
      {
        type: "Rect",
        icon: "i_rect",
        title: "矩形",
      },
      {
        type: "Circle",
        icon: "i_circle",
        title: "圆形",
      },
      {
        type: "Triangle",
        icon: "i_triangle",
        title: "三角形",
      },
      {
        type: "Picture",
        icon: "i_pic",
        title: "图片",
      },
    ],
    []
  );
  const brushMenus = useMemo(
    () => [
      {
        title: "铅笔",
        type: "Pencil",
        icon: "i_pencil",
        mode: "PencilBrush",
      },
      {
        title: "喷笔",
        type: "Spray",
        icon: "i_spray",
        mode: "SprayBrush",
      },
      {
        title: "圆形笔刷",
        type: "Circle",
        icon: "i_circleBrush",
        mode: "CircleBrush",
      },
    ],
    []
  );

  const [isShow, setIsShow] = useState(false);
  const clickHandle = (type: string) => {
    if (reg.test(mode)) return;
    setMode("default");
    if (type === "Picture") {
      setIsShow(true);
    } else {
      events.emit("createElement", type);
    }
  };
  const brushClick = (type: string, _mode: string) => {
    if (mode !== "default" && "Mode" + type !== mode) {
      return;
    }
    if ("Mode" + type === mode) {
      setMode("default");
      messageApi.open({
        type: "warning",
        content: "退出笔刷模式",
      });
      events.emit("switchBrush", _mode, false);
    } else {
      setMode("Mode" + type);
      messageApi.info("进入笔刷模式");
      events.emit("switchBrush", _mode, true);
    }
  };

  // 取消回调
  const cancelEvent = useCallback(() => {
    setIsShow(false);
  }, []);

  // 图形点击回调
  const shapeClickEvent = (shape: {
    path: string;
    viewBox: [number, number];
    outlined?: boolean;
  }) => {
    if (reg.test(mode)) return;
    events.emit("createElement", "svg", {
      svg: `<svg 
       xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        width="18"
        height="18">
        <g transform="scale(${18 / shape.viewBox[0]}, ${
        18 / shape.viewBox[1]
      }) translate(0,0) matrix(1,0,0,1,0,0)">
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="butt"
            strokeMiterlimit="8"
            fill="${shape.outlined ? "#999" : "transparent"}"
            stroke="${shape.outlined ? "transparent" : "#999"}"
            strokeWidth="2"
            d="${shape.path}"
          ></path>
        </g>
      </svg>`,
      shape,
    });
  };

  // 图片上传成功回调
  const successEvent = useCallback(
    (dataUrl: string, width: number, height: number) => {
      events.emit("createElement", "image", {
        dataUrl,
        width,
        height,
      });
      setIsShow(false);
    },
    []
  );

  const [previewType, setPreviewType] = useState("");
  const [shapePreview, setShapePreview] = useState("");

  // 普通元素开始拖拽
  const dragEvent = useCallback(({ clientX, clientY }: any) => {
    if (!previewDom || (lastX === clientX && lastY === clientY)) return;
    (lastX = clientX), (lastY = clientY);
    previewDom.style.left = clientX - previewDom.clientWidth / 2 + "px";
    previewDom.style.top = clientY - previewDom.clientHeight / 2 + "px";
  }, []);

  // 拖拽结束
  const dragEndEvent = useCallback(() => {
    previewDom!.style.left = "-9999px";
    (lastX = 0), (lastY = 0);
    setPreviewType("");
  }, []);

  const dragStartEvent = (ev: any, type: string) => {
    const img = new Image();
    img.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E";
    ev.dataTransfer.setDragImage(img, 0, 0);
    setPreviewType(type);
    previewDom = document.getElementById("preview-container") as HTMLDivElement;
    sessionStorage.setItem(
      "dragInfo",
      JSON.stringify({
        type,
      })
    );
  };

  // 图形开始拖拽回调
  const shapeDragStartEvent = (ev: any, shape: any, svg: string) => {
    setShapePreview(svg);
    setPreviewType("Shape");
    const img = new Image();

    img.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E";
    ev.dataTransfer.setDragImage(img, 0, 0);
    previewDom = document.getElementById("preview-container") as HTMLDivElement;
    sessionStorage.setItem(
      "dragInfo",
      JSON.stringify({
        type: "svg",
        options: {
          svg: `<svg 
        xmlns="http://www.w3.org/2000/svg"
         overflow="visible"
         width="18"
         height="18">
         <g transform="scale(${18 / shape.viewBox[0]}, ${
            18 / shape.viewBox[1]
          }) translate(0,0) matrix(1,0,0,1,0,0)">
           <path
             vectorEffect="non-scaling-stroke"
             strokeLinecap="butt"
             strokeMiterlimit="8"
             fill="${shape.outlined ? "#999" : "transparent"}"
             stroke="${shape.outlined ? "transparent" : "#999"}"
             strokeWidth="2"
             d="${shape.path}"
           ></path>
         </g>              
       </svg>`,
          shape,
        },
      })
    );
  };

  const reg = useMemo(() => /Mode.*/, []);

  return (
    <div className={style["menu-component"]}>
      <div
        id="preview-container"
        draggable={false}
        style={{
          pointerEvents: "none",
          userSelect: "none",
          position: "fixed",
          zIndex: 99999,
          top: "-9000px",
        }}
      >
        {previewType === "Shape" ? (
          <div
            dangerouslySetInnerHTML={{
              __html: shapePreview,
            }}
          ></div>
        ) : (
          <img
            style={{
              width: previewType === "Text" ? "150px" : "100px",
            }}
            src={
              previewType == "Rect"
                ? rectPreview
                : previewType === "Text"
                ? textPreview
                : previewType === "Triangle"
                ? trianglePreview
                : circlePreview
            }
          />
        )}
      </div>
      {contextHolder}
      <ImageUpload
        title="插入图片"
        isShow={isShow}
        cancelEvent={cancelEvent}
        successEvent={successEvent}
      />
      <SplitLine
        style={{
          marginTop: "10px",
        }}
        title="基础元素"
      />
      <div className={style["menu-container"]}>
        {menus.map((item: MenuItem) => (
          <div
            draggable={item.type !== "Picture" && !reg.test(mode)}
            onDragStart={(ev) => dragStartEvent(ev, item.type)}
            onDrag={dragEvent}
            onDragEnd={dragEndEvent}
            onClick={() => clickHandle(item.type)}
            key={item.icon}
            className={`${style["menu-item"]} ${
              reg.test(mode) ? style["disable-status"] : ""
            } ${style["dragbox"]}`}
          >
            <i className={`iconfont ${item.icon} ${style.icon}`}></i>
            <span
              style={{
                fontSize: "13px",
              }}
            >
              {item.title}
            </span>
          </div>
        ))}
      </div>

      <SplitLine
        style={{
          marginTop: "10px",
        }}
        title="笔刷"
      />
      <div className={style["menu-container"]}>
        {brushMenus.map((item: MenuItem) => (
          <div
            onClick={() => brushClick(item.type, item.mode as string)}
            key={item.icon}
            className={`${style["menu-item"]} ${
              mode === "Mode" + item.type
                ? style["active-menu-item"]
                : mode !== "default"
                ? style["disable-status"]
                : ""
            }`}
          >
            <i className={`iconfont ${item.icon} ${style.icon}`}></i>
            <span
              style={{
                fontSize: "13px",
              }}
            >
              {item.title}
            </span>
          </div>
        ))}
      </div>

      <SplitLine
        style={{
          marginTop: "10px",
        }}
        title="更多图形"
      />
      <div className={style["menu-shape-container"]}>
        <Collapse
          ghost
          items={SHAPE_LIST.map((item: ShapeItem) => ({
            key: item.type,
            label: item.type,
            children: (
              <div className={style["menu-shape-list"]}>
                {item.children.map(
                  (shape: {
                    path: string;
                    viewBox: [number, number];
                    outlined?: boolean;
                  }) => (
                    <div
                      onClick={() => shapeClickEvent(shape)}
                      className={`${style["shape-item"]} ${
                        reg.test(mode) ? style["disable-status"] : ""
                      }`}
                      key={shape.path}
                      draggable={!reg.test(mode)}
                      onDrag={dragEvent}
                      onDragEnd={dragEndEvent}
                      onDragStart={(ev) =>
                        shapeDragStartEvent(
                          ev,
                          shape,
                          `<svg overflow="visible" width="100" height="100">
                        <g
                          transform="scale(${
                            shape.viewBox[0] > 1000
                              ? 100 / shape.viewBox[0]
                              : 0.5
                          }, ${
                            shape.viewBox[1] > 1000
                              ? 100 / shape.viewBox[1]
                              : 0.5
                          }) translate(0,0) matrix(1,0,0,1,0,0)"
                        >
                          <path
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="butt"
                            strokeMiterlimit="8"
                            fill="${shape.outlined ? "#000" : "transparent"}"
                            stroke="${shape.outlined ? "transparent" : "#000"}"
                            stroke-width="${shape.viewBox[1] > 1000 ? 50 : 10}"
                            d="${shape.path}"
                          ></path>
                        </g>
                      </svg>`
                        )
                      }
                    >
                      <svg overflow="visible" width="18" height="18">
                        <g
                          transform={`scale(${18 / shape.viewBox[0]}, ${
                            18 / shape.viewBox[1]
                          }) translate(0,0) matrix(1,0,0,1,0,0)`}
                        >
                          <path
                            className={
                              reg.test(mode)
                                ? style["disable-shape-path"]
                                : style["shape-path"]
                            }
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="butt"
                            strokeMiterlimit="8"
                            fill={`${shape.outlined ? "#999" : "transparent"}`}
                            stroke={`${
                              shape.outlined ? "transparent" : "#999"
                            }`}
                            strokeWidth="2"
                            d={shape.path}
                          ></path>
                        </g>
                      </svg>
                    </div>
                  )
                )}
              </div>
            ),
          }))}
        />
      </div>
    </div>
  );
}

export default memo(Menu);
