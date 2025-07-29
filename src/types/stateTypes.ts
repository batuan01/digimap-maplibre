export type ToolType =
  | "pointer"
  | "hand"
  | "image"
  | "point"
  | "line"
  | "polygon"
  | "circle"
  | "rectangle"
  | "donut"
  | "path";

export interface AppState {
  selectedElementIds: string[];
  activeTool: ToolType;
}
