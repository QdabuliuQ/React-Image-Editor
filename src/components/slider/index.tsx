import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Slider } from "antd";

import events from "@/bus";
import { updateElementByIdx } from "@/store/actions/element";
import debounce from "@/utils/debounce";

import { Props } from "./type";

export default memo(function _Slider(props: Props) {
  const element = useSelector((state: any) => state.element)[props.idx];
  const dispatch = useDispatch();

  const onChange = useCallback(
    debounce((e: number) => {
      element[props.name] = e;
      dispatch(
        updateElementByIdx({
          idx: props.idx,
          data: JSON.parse(JSON.stringify(element)),
        })
      );

      events.emit("renderElement", {
        key: props.name,
        value: e,
        active: props.active,
      });
    }),
    []
  );

  return (
    <Slider
      style={{
        width: "100%",
      }}
      {...props.property}
      onChange={onChange}
      defaultValue={props.defaultValue}
    />
  );
});
