import { LOCAL_STORAGE_KEY } from "@/constants/mapConfig";
import { FeatureType } from "@/types/featureTypes";

export const saveToLocalStorage = (geojson: {
  type: string;
  features: FeatureType[];
}): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(geojson));
};

export const newDataToLocalStorage = (feature: FeatureType): void => {
  let geojson = loadFromLocalStorage();
  if (!geojson) {
    geojson = {
      type: "FeatureCollection",
      features: [],
    };
  }
  saveToLocalStorage({
    ...geojson,
    features: [...geojson.features, feature],
  });
};

export const removeFeatureFromLocalStorage = (idToRemove: string): void => {
  const geojson = loadFromLocalStorage();
  if (!geojson || !geojson.features) return;
  const updatedFeatures = geojson.features.filter(
    (feature: FeatureType) => feature.id !== idToRemove
  );
  saveToLocalStorage({
    ...geojson,
    features: updatedFeatures,
  });
};

export const updateFeatureInLocalStorage = (
  updatedFeature: FeatureType
): void => {
  if (!updatedFeature?.id) return;
  const geojson = loadFromLocalStorage();
  if (!geojson || !geojson.features) return;
  const updatedFeatures = geojson.features.map((feature: FeatureType) =>
    feature.id === updatedFeature.id ? updatedFeature : feature
  );
  saveToLocalStorage({
    ...geojson,
    features: updatedFeatures,
  });
};

export const loadFromLocalStorage = (): {
  type: string;
  features: FeatureType[];
} | null => {
  const geojson = localStorage.getItem(LOCAL_STORAGE_KEY);
  return geojson ? JSON.parse(geojson) : null;
};

export const clearLocalStorage = (): void =>
  localStorage.removeItem(LOCAL_STORAGE_KEY);
