import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputNumber } from "antd";

import events from "@/bus";
import { updateElementByIdx } from "@/store/actions/element";
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
      console.log(elements);

      events.emit("renderElement", {
        [props.name]: e,
      });
    }),
    []
  );
  const elements = useSelector((state: any) => state.element);
  const element = elements[props.idx];

  return (
    <InputNumber
      {...props.property}
      defaultValue={props.defaultValue}
      onChange={onChange}
    />
  );
});
