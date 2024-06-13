import { SelectProps } from "antd";

export interface Props {
  active: string;
  name: string;
  idx: number;
  code: number;
  type: "select";
  defaultValue: string;
  property: SelectProps;
}
