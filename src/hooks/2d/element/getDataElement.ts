import { Geometry } from "geojson";

export function getCoordinates(geometry: Geometry) {
  if (geometry.type !== "GeometryCollection" && "coordinates" in geometry) {
    return geometry.coordinates;
  }
  return null;
}
