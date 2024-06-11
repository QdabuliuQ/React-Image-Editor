import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateElementByIdx } from "@/store/actions/element";

import { Props } from "./type";

export default memo(function InputNumber(data: Props | any) {
  const dispatch = useDispatch();

  const onChange = useCallback((e: number) => {
    element[data.name] = e;
    dispatch(
      updateElementByIdx({
        idx: data.idx,
        data: JSON.parse(JSON.stringify(element)),
      })
    );
  }, []);
  const element = useSelector((state: any) => state.element)[data.idx];

  return (
    <InputNumber
      {...data.props}
      defaultValue={element[data.name]}
      onChange={onChange}
    />
  );
});
