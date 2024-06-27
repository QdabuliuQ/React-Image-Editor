import { memo } from "react";

import Canvas from "./components/canvas";
import Header from "./components/header";
import Menu from "./components/menu";
import Panel from "./components/panel";

import style from "./index.module.less";

export default memo(function Edit() {
  sessionStorage.setItem(
    "canvasInfo",
    JSON.stringify({
      width: 500,
      height: 600,
    })
  );

  return (
    <div className={style["edit-page"]}>
      <Header />
      <div className={style["edit-container"]}>
        <Menu />
        <Canvas />
        <Panel />
      </div>
    </div>
  );
});
