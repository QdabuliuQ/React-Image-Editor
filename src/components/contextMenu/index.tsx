import {
  forwardRef,
  memo,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import useClickOutside from "@/hooks/useClickOutside";

import { MenuItem, Props } from "./type";

import style from "./index.module.less";

// eslint-disable-next-line react-refresh/only-export-components
export default memo(
  forwardRef(function ContextMenu(props: Props, ref) {
    const [visible, setVisible] = useState<boolean>(false);
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);
    const domRef = useRef(null);

    useImperativeHandle(ref, () => ({
      hide: () => setVisible(false),
      show: (x: number, y: number) => {
        setVisible(true);
        setX(x);
        setY(y);
      },
    }));

    useClickOutside(domRef, () => {
      setVisible(false);
    });

    return visible ? (
      <div
        ref={domRef}
        style={{
          left: x + "px",
          top: y + "px",
        }}
        className={style["context-menu"]}
      >
        {props.menuData ? (
          props.menuData.map((item: MenuItem | ReactNode, index: number) =>
            (item as MenuItem).title ? (
              <div
                onClick={() => props.menuClick((item as MenuItem).title)}
                key={(item as MenuItem).title}
                className={style["menu-item"]}
              >
                {(item as MenuItem).prefix ? (item as MenuItem).prefix : <></>}
                <span>{(item as MenuItem).title}</span>
                {(item as MenuItem).suffix ? (item as MenuItem).suffix : <></>}
              </div>
            ) : (
              <div key={index}>{item as ReactNode}</div>
            )
          )
        ) : (
          <></>
        )}
      </div>
    ) : (
      <></>
    );
  })
);
