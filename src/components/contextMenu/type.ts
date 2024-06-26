import { ReactNode } from "react";

export interface MenuItem {
  title: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export interface Props {
  menuData: Array<MenuItem | ReactNode>;
  menuClick: (title: string) => void;
}
