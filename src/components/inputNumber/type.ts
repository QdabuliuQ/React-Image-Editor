import { InputNumberProps } from "antd";

export interface Props {
  name: string;
  idx: number;
  code: number;
  type: "inputNumber";
  defaultValue: number;
  property: InputNumberProps;
}
