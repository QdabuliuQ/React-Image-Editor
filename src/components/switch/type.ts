import { SwitchProps } from "antd";

export interface Props {
  active: string;
  name: string;
  idx: number;
  code: number;
  type: "switch";
  defaultValue: boolean;
  property: SwitchProps;
}
