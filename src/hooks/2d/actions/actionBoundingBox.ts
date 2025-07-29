import { AppGlobals } from "@/lib/appGlobals";
import { FeatureType } from "@/types/featureTypes";
import { AppState } from "@/types/stateTypes";
import * as turf from "@turf/turf";
import { Map } from "maplibre-gl";
import { getSourceElement } from "../element/getDataElement";
import { isImageElement, isPathElement } from "../element/typeChecks";
import { ActionLoadImage } from "./actionLoadImage";
import { ActionSelectedElement2D } from "./actionSelectedElement2D";

export class ActionBoundingBox {
  static drawBoundingBox = (
    feature: FeatureType,
    map: Map,
    layerType: string = "hover"
  ) => {
    if (!map || !feature) return;
    if (isPathElement(feature)) return;

    const bboxPolygon = this.getMinimumRotatedBBox([feature]);
    if (!bboxPolygon) return;

    bboxPolygon.properties = { type: `${layerType}-bbox` };

    const sourceId = `bbox-${layerType}`;
    const layerId = `bbox-${layerType}-line`;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
    }

    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        layout: {},
        paint: {
          "line-color": layerType === "hover" ? "#0099FF" : "#7f17f5",
          "line-width": 3,
          ...(layerType === "hover" ? { "line-dasharray": [4, 2] } : {}),
        },
      });
    }

    const source = getSourceElement(map, sourceId);
    if (source) {
      source.setData({
        type: "FeatureCollection",
        features: [bboxPolygon],
      });
    }
  };

  static drawBoundingBoxMultiple = (
    features: FeatureType[],
    map: Map,
    layerType: string = "hover"
  ) => {
    if (!map || !features || features.length === 0) return;

    // Bỏ qua các loại không hỗ trợ bbox
    const validFeatures = features.filter((f) => !isPathElement(f));
    if (validFeatures.length === 0) return;

    // Tạo rotated bounding box bao quanh tất cả features hợp lệ
    const bboxPolygon = this.getMinimumRotatedBBox(validFeatures);
    if (!bboxPolygon) return;

    bboxPolygon.properties = { type: `${layerType}-bbox` };

    const sourceId = `bbox-${layerType}`;
    const layerId = `bbox-${layerType}-line`;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
    }

    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        layout: {},
        paint: {
          "line-color": layerType === "hover" ? "#0099FF" : "#7f17f5",
          "line-width": 3,
          ...(layerType === "hover" ? { "line-dasharray": [4, 2] } : {}),
        },
      });
    }

    const source = getSourceElement(map, sourceId);
    if (source) {
      source.setData({
        type: "FeatureCollection",
        features: [bboxPolygon],
      });
    }
  };

  static hoverBBoxSelected = (
    map: Map,
    getAppState: () => AppState,
    selectedElement?: FeatureType | null
  ) => {
    if (!map) return;

    map.on("mousemove", (e) => {
      const appState = getAppState();
      if (appState.activeTool === "hand") {
        return;
      }

      if (selectedElement || AppGlobals.getElements()?.length === 0) {
        this.clearBoundingBox(map, "hover");
        return;
      }

      const clickedLngLat = [e.lngLat.lng, e.lngLat.lat];
      const storedData = AppGlobals.getElements();
      if (!storedData?.length) return;

      const hoveredPolygon = ActionSelectedElement2D.findFeatureAtPoint(
        clickedLngLat,
        storedData
      );

      if (isPathElement(hoveredPolygon)) return;

      if (hoveredPolygon) {
        const polygonFeature = isImageElement(hoveredPolygon)
          ? ActionLoadImage.convertPoligon(hoveredPolygon)
          : hoveredPolygon;
        this.drawBoundingBox(polygonFeature, map, "hover");
      } else {
        this.clearBoundingBox(map, "hover");
      }
    });
  };

  static clearBoundingBox = (map: Map, layerType: string = "hover") => {
    const sourceId = `bbox-${layerType}`;
    const source = getSourceElement(map, sourceId);

    if (source) {
      source.setData({
        type: "FeatureCollection",
        features: [],
      });
    }
  };

  static getMinimumRotatedBBox = (features: FeatureType[]): any | null => {
    if (!features || features.length === 0) return null;

    // Gom tất cả feature lại thành 1 FeatureCollection
    const featureCollection = {
      type: "FeatureCollection",
      features,
    };

    // Tính convex hull tổng
    const convexHull = turf.convex(featureCollection as any);
    if (!convexHull) return null;

    const coords = convexHull.geometry.coordinates[0];
    let minArea = Infinity;
    let bestPolygon = null;

    for (let i = 0; i < coords.length - 1; i++) {
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const angle = -Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * (180 / Math.PI);

      const rotated = turf.transformRotate(featureCollection as any, angle, {
        pivot: turf.centroid(featureCollection as any),
        mutate: false,
      });

      const bbox = turf.bbox(rotated);
      const rect = turf.bboxPolygon(bbox);
      const area = turf.area(rect);

      if (area < minArea) {
        minArea = area;
        bestPolygon = turf.transformRotate(rect, -angle, {
          pivot: turf.centroid(featureCollection as any),
          mutate: false,
        });
      }
    }

    return bestPolygon;
  };
}
