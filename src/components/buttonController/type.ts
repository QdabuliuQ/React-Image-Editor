export interface Props {
  scaleDownEvent: (...args: any) => void;
  scaleUpEvent: (...args: any) => void;
  scaleInitEvent: (...args: any) => void;
  clearEvent: (...args: any) => void;
}
