import { AppGlobals } from "@/lib/appGlobals";
import {
  isLineElement,
  isPathElement,
  isPolygonElement,
} from "../element/typeChecks";
import { ActionBoundingBox } from "./actionBoundingBox";
import { ActionHandleDragging } from "./actionHandleDragging";
import { LayerActions } from "./actionLayer";
import { ActionRotateElement } from "./actionRotateElement";
import { Map, MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";
import { FeatureType } from "@/types/featureTypes";
import { getSourceElement } from "../element/getDataElement";

export class ActionRemovePoint {
  static targetPoint: MapGeoJSONFeature | null = null;
  static parentFeature: FeatureType | null = null;

  static setRemovePoint(map: Map, e: MapMouseEvent) {
    const featuresHandles = map.queryRenderedFeatures(e.point, {
      layers: ["handles-layer"],
    });

    if (!featuresHandles.length) return;

    const { parentId } = featuresHandles[0].properties;
    const allFeatures = AppGlobals.getElements();
    const targetFeature = allFeatures.find((f) => f.id === parentId);
    if (!targetFeature) return;

    this.targetPoint = featuresHandles[0];
    this.parentFeature = targetFeature;
  }

  static resetRemovePoint() {
    this.targetPoint = null;
    this.parentFeature = null;
  }

  static removeOnlyPoint(map: Map) {
    if (!this.targetPoint || !this.parentFeature) return;

    if (
      !isPathElement(this.parentFeature) &&
      !isPolygonElement(this.parentFeature) &&
      !isLineElement(this.parentFeature)
    )
      return;

    const geometryType = this.parentFeature.geometry.type;
    const { index } = this.targetPoint.properties;
    const indexNum = Number(index);

    let coordinates = JSON.parse(
      JSON.stringify(this.parentFeature.geometry.coordinates)
    ); // deep clone

    // ==========================
    // ✅ POLYGON
    // ==========================
    if (geometryType === "Polygon") {
      let ring = coordinates[0];

      if (ring.length <= 4) {
        // Xoá toàn bộ polygon nếu không đủ điểm
        coordinates = [];
      } else {
        if (indexNum === 0) {
          // Xoá điểm đầu và cuối
          ring.splice(0, 1);
          ring.pop();
          const newFirst = ring[0];
          ring.push([...newFirst]);
        } else {
          ring.splice(indexNum, 1);
        }

        coordinates = [ring];
      }
    }

    // ==========================
    // ✅ LINESTRING
    // ==========================
    else if (geometryType === "LineString") {
      if (coordinates.length <= 2) {
        // Xoá toàn bộ line nếu không đủ điểm
        coordinates = [];
      } else {
        coordinates.splice(indexNum, 1);
      }
    }

    // ==========================
    // ✅ MULTILINESTRING
    // ==========================
    else if (geometryType === "MultiLineString") {
      const indexRaw = JSON.parse(index);
      const pointIndex = Number(indexRaw.pointIndex);
      const lineIndex = Number(indexRaw.lineIndex);

      const line = coordinates[lineIndex];

      if (!line) return;

      if (line.length <= 2) {
        // Xóa nguyên cả line nếu chỉ còn 2 điểm hoặc ít hơn
        coordinates.splice(lineIndex, 1);
      } else {
        // Chỉ xóa 1 điểm
        line.splice(pointIndex, 1);
        coordinates[lineIndex] = line;
      }
    }

    // ==========================
    // ✅ UPDATE
    // ==========================
    if (coordinates.length === 0) {
      const sourceId = LayerActions.findFeatureSourceId(
        map,
        this.parentFeature
      );
      const layerIds = LayerActions.findFeatureLayerId(map, this.parentFeature);
      for (const layer of layerIds) {
        LayerActions.removeLayer(map, layer);
      }

      LayerActions.removeSource(map, sourceId);

      ActionHandleDragging.removeHandlesPoint(map);
      ActionBoundingBox.clearBoundingBox(map, "selected");
      ActionBoundingBox.clearBoundingBox(map, "hover");
      ActionRotateElement.destroy(map);

      AppGlobals.removeDataById(this.parentFeature.id);
    } else {
      const updatedFeature = {
        ...this.parentFeature,
        geometry: {
          ...this.parentFeature.geometry,
          coordinates,
        },
      };

      const sourceId = LayerActions.findFeatureSourceId(
        map,
        this.parentFeature
      );

      if (!sourceId) return;
      const source = getSourceElement(map, sourceId);
      if (source) {
        source.setData({
          type: "FeatureCollection",
          features: [updatedFeature],
        });
      }

      ActionHandleDragging.newHandlesPoint(map, updatedFeature);
      AppGlobals.setDataToStore(updatedFeature);
    }
  }
}
