import { FeatureType } from "@/types/featureTypes";
import { Geometry } from "geojson";
import { Map } from "maplibre-gl";

export function getCoordinates(geometry: Geometry) {
  if (geometry.type !== "GeometryCollection" && "coordinates" in geometry) {
    return geometry.coordinates;
  }
  return null;
}

export function getSourceElement(map: Map, sourceId: string) {
  return map.getSource(sourceId) as maplibregl.GeoJSONSource;
}

export function getFeaturesBySource(source: maplibregl.GeoJSONSource | null) {
  if (!source) return [];
  const sourceData = source._data || source._options?.data;
  const features =
    typeof sourceData !== "string" && sourceData?.type === "FeatureCollection"
      ? (sourceData?.features as FeatureType[])
      : [];

  return features;
}
