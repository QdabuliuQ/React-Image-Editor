import { memo } from "react";

export default memo(function Test(props: {
  cb: (...args: Array<any>) => void;
}) {
  console.log("render");

  return <div onClick={props.cb}>Test</div>;
});
