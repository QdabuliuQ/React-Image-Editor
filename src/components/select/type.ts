import { SelectProps } from "antd";

export interface Props {
  name: string;
  idx: number;
  code: number;
  type: "select";
  defaultValue: string;
  property: SelectProps;
}
