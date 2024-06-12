import { memo } from "react";

import Canvas from "./components/canvas";
import Menu from "./components/menu";
import Panel from "./components/panel";

import "./index.less";

export default memo(function Edit() {
  return (
    <div className="edit-page">
      <Menu />
      <Canvas />
      <Panel />
    </div>
  );
});
