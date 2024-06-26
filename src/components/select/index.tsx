import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";

import events from "@/bus";
import { updateElementByIdx } from "@/store/modules/element/action";
import debounce from "@/utils/debounce";

import { Props } from "./type";

export default memo(function _Select(props: Props) {
  const element = useSelector((state: any) => state.element)[props.idx];
  const dispatch = useDispatch();

  const onChange = useCallback(
    debounce((e: string) => {
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
    <Select
      defaultValue={props.defaultValue}
      style={{ width: "100%" }}
      onChange={onChange}
      {...props.property}
    />
  );
});
