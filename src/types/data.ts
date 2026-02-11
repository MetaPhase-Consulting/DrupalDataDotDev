export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface ChartPoint {
  x: number;
  y: number;
  r?: number;
}

export interface ChartDataset {
  label: string;
  data: Array<number | ChartPoint>;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface ChartJsLikeData {
  labels?: string[];
  datasets: ChartDataset[];
}

export interface GeoPoint {
  lat: number;
  lng: number;
  label?: string;
  value?: number;
  [key: string]: JsonValue | undefined;
}

export interface ManualInputRow {
  id: string;
  label: string;
  value: string;
  secondaryValue?: string;
  lat?: string;
  lng?: string;
}

export type VisualizationData = ChartJsLikeData | GeoPoint[] | JsonObject | JsonValue[];
