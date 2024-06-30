export interface Canvas {
  width: number;
  height: number;
  fill: string;
  getObjects: () => any
  loadFromJSON?: (json: any) => any;
  toDatalessJSON?: (...args: Array<any>) => any;
  forEachObject?: (callback: (object: any) => void) => void;
  remove?: (object: any) => void;
  setViewportTransform?: (points: Array<number>) => void,
  toDataURL?: (option: {
    format: string
    quality: number
    width: number
    height: number
  }) => string
  toSVG?: (option: {
    width: number
    height: number
    viewBox: {
      x: number
      y: number
      width: number
      height: number
    }
  }) => BlobPart
}
