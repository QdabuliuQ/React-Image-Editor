import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputNumber } from "antd";

import events from "@/bus";
import { updateElementByIdx } from "@/store/modules/element/action";
import debounce from "@/utils/debounce";

import { Props } from "./type";

export default memo(function _InputNumber(props: Props) {
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
  const element = useSelector((state: any) => state.element)[props.idx];

  return props.property ? (
    <InputNumber
      {...props.property}
      defaultValue={props.defaultValue}
      onChange={onChange}
    />
  ) : (
    <InputNumber defaultValue={props.defaultValue} onChange={onChange} />
  );
});
