import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "antd";

import { updateElementByIdx } from "@/store/actions/element";
import debounce from "@/utils/debounce";

import { Props } from "./type";

export default memo(function _Switch(props: Props) {
  const onChange = useCallback(
    debounce((e: boolean) => {
      element[props.name] = e;
      dispatch(
        updateElementByIdx({
          idx: props.idx,
          data: JSON.parse(JSON.stringify(element)),
        })
      );
    }),
    []
  );

  const element = useSelector((state: any) => state.element)[props.idx];
  const dispatch = useDispatch();
  return (
    <Switch
      defaultChecked={props.defaultValue}
      {...props.property}
      onChange={onChange}
    />
  );
});
