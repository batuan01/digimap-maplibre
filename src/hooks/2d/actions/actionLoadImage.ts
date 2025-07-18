
import { calculateImageBoundsWithAspect, generateUUID } from "@/constants/mapConfig";
import { AppGlobals } from "@/lib/appGlobals";
import { FeatureType } from "@/types/featureTypes";
import { Map } from "maplibre-gl";
import { ActionLoadData2D } from "./actionLoadData2D";
import { newDataToLocalStorage } from "@/lib/localStorageUtils";

export class ActionLoadImage {
  static add = (map: Map, imageDataUrl: string): void => {
    map.once("click", (e: any) => {
      const img = new Image();
      img.onload = () => {
        try {
          const imageId = generateUUID();
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          const bounds = calculateImageBoundsWithAspect(
            e.lngLat,
            0.001,
            aspectRatio
          );
          const newIndex = AppGlobals.getMaxIndex() + 1;
          const imageFeature: FeatureType = {
            type: "Feature",
            id: imageId,
            geometry: {
              type: "Image",
              coordinates: bounds,
            },
            properties: {
              type: "Image",
              id: imageId,
              index: newIndex,
              imageUrl: imageDataUrl,
            },
          };
          const geojson = {
            type: "FeatureCollection",
            sourceType: "Image",
            features: [imageFeature],
          };
          ActionLoadData2D.AddFeature(geojson, map, imageId);
          AppGlobals.setDataToStore(imageFeature);
          newDataToLocalStorage(imageFeature);
        } catch (err) {
          console.error("❌ Không thể thêm ảnh vào map:", err);
        }
      };
      img.src = imageDataUrl;
    });
  };

  static convertPoligon(feature: FeatureType): FeatureType {
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        type: "Polygon",
        coordinates: [
          [...feature.geometry.coordinates, feature.geometry.coordinates[0]],
        ],
      },
    };
  }

  static convertImage(feature: FeatureType): FeatureType {
    const coords = feature.geometry.coordinates?.[0];
    if (feature.geometry.type !== "Polygon" || !coords) return feature;
    const simplified =
      coords.length > 1 &&
      coords[0][0] === coords.at(-1)[0] &&
      coords[0][1] === coords.at(-1)[1]
        ? coords.slice(0, -1)
        : coords;
    return {
      ...feature,
      geometry: {
        type: "Image",
        coordinates: simplified,
      },
    };
  }
}
