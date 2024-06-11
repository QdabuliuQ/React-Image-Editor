import { memo, useMemo } from "react";

import { MenuItem } from "./type";

import "./index.less";

function Menu() {
  const menus = useMemo(
    () => [
      {
        type: "text",
        icon: "i_text",
        title: "文本",
      },
      {
        type: "shape",
        icon: "i_shape",
        title: "形状",
      },
    ],
    []
  );

  return (
    <div className="menu-component">
      <div className="menu-container">
        {menus.map((item: MenuItem) => (
          <div key={item.icon} className="menu-item">
            <i className={`iconfont ${item.icon}`}></i>
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(Menu);
