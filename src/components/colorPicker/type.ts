import { ColorPickerProps } from "antd";

export interface Props {
  active: string;
  name: string;
  idx: number;
  code: number;
  type: "colorPicker";
  defaultValue: string;
  property: ColorPickerProps;
}
