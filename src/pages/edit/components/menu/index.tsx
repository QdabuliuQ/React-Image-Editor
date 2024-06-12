import { memo, useCallback, useMemo } from "react";

import events from "@/bus";

import { MenuItem } from "./type";

import "./index.less";

function Menu() {
  const menus = useMemo(
    () => [
      {
        type: "Text",
        icon: "i_text",
        title: "文本",
      },
      {
        type: "Shape",
        icon: "i_shape",
        title: "形状",
      },
    ],
    []
  );

  const clickHandle = useCallback((type: string) => {
    events.emit("createElement", type);
  }, []);

  return (
    <div className="menu-component">
      <div className="menu-container">
        {menus.map((item: MenuItem) => (
          <div
            onClick={() => clickHandle(item.type)}
            key={item.icon}
            className="menu-item"
          >
            <i className={`iconfont ${item.icon}`}></i>
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(Menu);
