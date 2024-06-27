declare interface Window {
  _instance: any;
  redoStack: Array<any>;
  undoStack: Array<any>;
  elementMap: Map<string, any>
}
