import { SwitchProps } from "antd";

export interface Props {
  name: string;
  idx: number;
  code: number;
  type: "switch";
  defaultValue: boolean;
  property: SwitchProps;
}
