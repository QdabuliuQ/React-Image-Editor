export interface ShapeItem {
  type: string;
  children: Array<Shape>;
}

export interface Shape {
  viewBox: [number, number];
  path: string;
  outlined?: boolean;
}
