import { FeatureType } from "@/types/featureTypes";

export const isPathElement = (element: FeatureType) => {
  return (
    element != null && element?.properties?.type?.toLowerCase?.() === "path"
  );
};

export const isImageElement = (element: FeatureType) => {
  return (
    element != null && element?.properties?.type?.toLowerCase?.() === "image"
  );
};

export const isPolygonElement = (element: FeatureType) => {
  return (
    element != null && element?.properties?.type?.toLowerCase?.() === "polygon"
  );
};

export const isLineElement = (element: FeatureType) => {
  return (
    element != null &&
    element?.properties?.type?.toLowerCase?.() === "linestring"
  );
};
