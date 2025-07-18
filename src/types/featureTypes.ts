import type {
  Feature,
  FeatureCollection,
  Geometry,
  LineString,
  MultiLineString,
  MultiPoint,
  Point,
  Polygon,
} from "geojson";

type ImageGeometry = {
  type: "Image";
  coordinates: [number, number][];
};

type LineStringGeometry = {
  type: "LineString";
  coordinates: [number, number][];
};

type PolygonGeometry = {
  type: "Polygon";
  coordinates: [number, number][][];
};

type MultiPolygonGeometry = {
  type: "MultiPolygon";
  coordinates: [number, number][][][];
};

type MultiLineStringGeometry = {
  type: "MultiLineString";
  coordinates: [number, number][][];
};

type PointGeometry = {
  type: "Point";
  coordinates: [number, number];
};

export type FeatureGeometry =
  | ImageGeometry
  | LineStringGeometry
  | PolygonGeometry
  | MultiLineStringGeometry
  | PointGeometry;

// Example of a more specific properties type. Adjust as needed for your app.
export interface FeatureProperties {
  id: string;
  color?: string;
  height?: number | string;
  label?: string;
  index?: number;
  layer?: string;
  type?: string;
  imageUrl?: string;
  labelImage?: string;
  [key: string]: any; // fallback for extra properties
}

// export type FeatureType = {
//   type: "Feature";
//   id: string;
//   geometry: FeatureGeometry;
//   properties: FeatureProperties;
// };

type AllowedGeometry =
  | Point
  | MultiPoint
  | LineString
  | MultiLineString
  | Polygon;
export interface FeatureType extends Feature<AllowedGeometry> {}

// export interface FeatureType extends Feature<Geometry> {}

export interface FeatureCollectionType {
  type: "FeatureCollection";
  features: FeatureType[];
}

export interface GroupFeatureType extends FeatureCollectionType {
  sourceType: string;
}

// Một điểm: [kinh độ, vĩ độ]
export type LonLat = [number, number];

// Một đường hoặc chuỗi điểm (dành cho LineString hoặc Image)
export type Path = LonLat[];

// Một vùng nhiều vòng khép kín (dành cho Polygon hoặc MultiLineString)
export type Area = LonLat[][];

// Union cho tất cả kiểu có thể xuất hiện trong GeoJSON `coordinates`
export type AnyCoords = LonLat | Path | Area;
