export interface Canvas {
  width: number;
  height: number;
  fill: string;
  loadFromJSON: (json: any) => any;
  toDatalessJSON: (...args: Array<any>) => any;
  forEachObject: (callback: (object: any) => void) => void;
  remove: (object: any) => void;
}
