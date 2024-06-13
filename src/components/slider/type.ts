import { SliderBaseProps } from "antd/es/slider";

export interface Props {
  active: string;
  name: string;
  idx: number;
  code: number;
  type: "slider";
  defaultValue: number;
  property: SliderBaseProps;
}
