export interface Props {
  title?: string;
  isShow: boolean;
  cancelEvent: () => void;
  successEvent: (dataUrl: string, width: number, height: number) => void;
}
