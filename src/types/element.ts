export interface CommonProps {
  _data: {
    id: string;
  };
}
export interface Text extends CommonProps {
  type: "text";
  [propName: string]: any;
}

export type Element = Text;
