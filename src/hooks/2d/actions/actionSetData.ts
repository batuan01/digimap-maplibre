import { GeoJSONSource, ImageSource, Map } from "maplibre-gl";
import { isImageElement } from "../element/typeChecks";
import { ActionHandleDragging } from "./actionHandleDragging";
import { FeatureCollectionType, FeatureType } from "@/types/featureTypes";
import {
  getFeaturesBySource,
  getSourceElement,
} from "../element/getDataElement";

export class ActionSetData {
  // static setSelectedData(map, data) {
  //   if (data && !map.getSource(`source-${data.id}`)) return;
  //   map.getSource(`source-${data.id}`).setData({
  //     type: "FeatureCollection",
  //     features: [data],
  //   });
  // }

  static setSelectedData(map: Map, data: any, sourceId?: string | null) {
    const id = sourceId ?? (data.source || `source-${data.id}`);
    const source = map.getSource(id);

    if (!source) return;

    // Nếu là ảnh raster (image)
    if (isImageElement(data)) {
      const coordinates = data.geometry?.coordinates;

      // Chỉ cập nhật nếu source là type: 'image'
      if ("setCoordinates" in source && coordinates) {
        try {
          (source as ImageSource).setCoordinates(coordinates);
        } catch (err) {
          console.warn("Không thể cập nhật ảnh:", err);
        }
      }

      return;
    }

    // Trường hợp GeoJSON (Polygon, LineString, ...)
    const currentData = getFeaturesBySource(source as any);
    if (currentData.length == 0) return;

    const updatedFeatures = currentData.map((feature) =>
      feature.id === data.id ? data : feature
    );

    const newData: FeatureCollectionType = {
      type: "FeatureCollection",
      features: updatedFeatures,
    };

    (source as GeoJSONSource).setData(newData);
  }

  static setHandlesData(map: Map, data: FeatureType) {
    const sourceData = getSourceElement(map, "handles-source");
    if (data || !sourceData) return;
    const newHandles = ActionHandleDragging.getCornerHandles(data);

    sourceData.setData({
      type: "FeatureCollection",
      features: newHandles,
    });
  }
}
