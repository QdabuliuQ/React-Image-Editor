import {
  ColorPickerProps,
  InputNumberProps,
  SelectProps,
  SliderSingleProps,
  SwitchProps,
} from "antd";

interface CommonConfig<T extends string> {
  title: string;
  name: string;
  type: T;
}

export interface ColorPickerConfig extends CommonConfig<"colorPicker"> {
  property?: ColorPickerProps;
}

export interface InputNumberConfig extends CommonConfig<"inputNumber"> {
  property?: InputNumberProps;
}

export interface SelectConfig extends CommonConfig<"select"> {
  property?: SelectProps;
}

export interface SwitchConfig extends CommonConfig<"switch"> {
  property?: SwitchProps;
}

export interface SliderConfig extends CommonConfig<"slider"> {
  property?: SliderSingleProps;
}

export type Config =
  | ColorPickerConfig
  | InputNumberConfig
  | SelectConfig
  | SwitchConfig
  | SliderConfig;
