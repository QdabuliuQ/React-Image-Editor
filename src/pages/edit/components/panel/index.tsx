import { memo, useEffect } from "react";
import { useSelector } from "react-redux";

import "./index.less";

function Panel() {
  const active = useSelector((state: any) => state.active);

  useEffect(() => {
    console.log("change");
  }, [active]);

  return <div className="panel-component">Panel</div>;
}

export default memo(Panel);
