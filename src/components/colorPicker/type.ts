import { ColorPickerProps } from "antd";

export interface Props {
  name: string;
  idx: number;
  code: number;
  type: "colorPicker";
  defaultValue: string;
  property: ColorPickerProps;
}
