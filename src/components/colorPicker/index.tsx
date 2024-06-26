import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ColorPicker } from "antd";

import events from "@/bus";
import { updateElementByIdx } from "@/store/modules/element/action";
import debounce from "@/utils/debounce";

import { Props } from "./type";

export default memo(function _ColorPicker(props: Props) {
  const dispatch = useDispatch();
  const element = useSelector((state: any) => state.element)[props.idx];
  const onChange = useCallback(
    debounce((_, e) => {
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

  return props.property ? (
    <ColorPicker
      {...props.property}
      defaultValue={props.defaultValue}
      onChange={onChange}
    />
  ) : (
    <ColorPicker defaultValue={props.defaultValue} onChange={onChange} />
  );
});
