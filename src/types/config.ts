import {
  ColorPickerProps,
  InputNumberProps,
  SelectProps,
  SliderSingleProps,
  SwitchProps,
} from "antd";

export enum ControllerType {
  colorPicker = "colorPicker",
  inputNumber = "inputNumber",
  select = "select",
  switch = "switch",
  slider = "slider",
}

interface CommonConfig<T> {
  title: string;
  name: string;
  type: T;
}

export interface ColorPickerConfig
  extends CommonConfig<ControllerType.colorPicker> {
  property?: ColorPickerProps;
}

export interface InputNumberConfig
  extends CommonConfig<ControllerType.inputNumber> {
  property?: InputNumberProps;
}

export interface SelectConfig extends CommonConfig<ControllerType.select> {
  property?: SelectProps;
}

export interface SwitchConfig extends CommonConfig<ControllerType.switch> {
  property?: SwitchProps;
}

export interface SliderConfig extends CommonConfig<ControllerType.slider> {
  property?: SliderSingleProps;
}

export type Config =
  | ColorPickerConfig
  | InputNumberConfig
  | SelectConfig
  | SwitchConfig
  | SliderConfig;
