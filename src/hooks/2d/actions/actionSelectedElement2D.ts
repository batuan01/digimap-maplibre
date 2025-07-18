import * as turf from "@turf/turf";
import { handleMoveElement } from "./actionDragElement";
import { isImageElement, isPolygonElement } from "../element/typeChecks";
import { ActionLoadImage } from "./actionLoadImage";
import { AppGlobals } from "@/lib/appGlobals";
import { ActionBoundingBox } from "./actionBoundingBox";
import { ActionHandleDragging } from "./actionHandleDragging";
import { ActionRotateElement } from "./actionRotateElement";
import { ActionRemovePoint } from "./actionRemovePoint";
import { LayerActions } from "./actionLayer";
import { ActionSetData } from "./actionSetData";

export class ActionSelectedElement2D {
  static findFeatureAtPoint(point, features) {
    const clickedPoint = turf.point(point);

    return [...features]
      .sort((a, b) => Number(b.properties.index) - Number(a.properties.index))
      .find((feature) => {
        const geom = feature.geometry;
        if (!geom) return false;

        // Polygon & MultiPolygon
        if (geom.type === "Polygon" || geom.type === "MultiPolygon") {
          return turf.booleanPointInPolygon(clickedPoint, feature);
        }

        // Custom type "Image" dạng Polygon
        if (isImageElement(feature)) {
          const imagePoly = ActionLoadImage.convertPoligon(feature);
          return turf.booleanPointInPolygon(clickedPoint, imagePoly);
        }

        // LineString
        if (geom.type === "LineString") {
          const distance = turf.pointToLineDistance(clickedPoint, feature, {
            units: "meters",
          });

          return distance < 10;
        }

        // MultiLineString
        if (geom.type === "MultiLineString") {
          return geom.coordinates.some((line) => {
            const lineFeature = turf.lineString(line);
            const distance = turf.pointToLineDistance(
              clickedPoint,
              lineFeature,
              {
                units: "meters",
              }
            );
            return distance < 10;
          });
        }

        // Point
        if (geom.type === "Point") {
          const dist = turf.distance(clickedPoint, feature, {
            units: "meters",
          });
          return dist < 5; // Cho phép khoảng cách < 5m là "trúng"
        }

        return false;
      });
  }

  static getSelectedElement({ map, setSelectedElement }) {
    map.on("click", (e) => {
      const clickedLngLat = [e.lngLat.lng, e.lngLat.lat];
      const storedData = AppGlobals.getElements();
      if (!storedData?.length) return;

      const feature = this.findFeatureAtPoint(clickedLngLat, storedData);

      if (feature) {
        setSelectedElement(feature);
        map.dragPan.disable();
      } else {
        setSelectedElement(null);
        ActionBoundingBox.clearBoundingBox({ map, layerType: "selected" });
        ActionHandleDragging.removeHandlesPoint(map);
        ActionRotateElement.destroy(map);
        map.dragPan.enable();
      }

      // selecect point handle
      if (!map.getLayer("handles-layer")) return;
      const featuresHandles = map.queryRenderedFeatures(e.point, {
        layers: ["handles-layer"],
      });

      if (featuresHandles.length) {
        ActionRemovePoint.setRemovePoint(map, e);
      } else {
        ActionRemovePoint.resetRemovePoint();
      }
    });
  }

  static getDoubleClickSelection({ map, setSelectedElement }) {
    map.on("dblclick", (e) => {
      e.preventDefault();
      map.dragPan.disable();

      const clickedLngLat = [e.lngLat.lng, e.lngLat.lat];
      const storedData = AppGlobals.getElements();
      if (!storedData?.length) return;

      const feature = this.findFeatureAtPoint(clickedLngLat, storedData);
      if (!feature) return;

      const sourceId = LayerActions.findFeatureSourceId(map, feature);
      if (!sourceId) return;

      setSelectedElement(feature); // set state app

      // Xử lý chuẩn hóa thành Polygon để vẽ bbox và xoay
      let targetPolygon = null;
      switch (feature.geometry.type) {
        case "Polygon":
        case "MultiPolygon":
        case "LineString":
        case "MultiLineString":
          targetPolygon = feature;
          break;

        case "Image":
          if (isImageElement(feature)) {
            targetPolygon = ActionLoadImage.convertPoligon(feature);
          }
          break;

        case "Point":
          const buffer = turf.buffer(feature, 0.0001, { units: "degrees" });
          if (isPolygonElement(buffer)) {
            targetPolygon = buffer;
          }
          break;

        default:
          console.warn("Không hỗ trợ type:", feature.geometry.type);
      }

      if (targetPolygon) {
        if (!(targetPolygon.geometry.type === "MultiLineString")) {
          ActionRotateElement.addHandle(map, targetPolygon);

          ActionRotateElement.setup(map, feature, (rotated) => {
            ActionSetData.setSelectedData(map, rotated, sourceId); // cập nhật lại vào source
          });
        } else {
          ActionBoundingBox.clearBoundingBox({ map, layerType: "selected" });
          ActionBoundingBox.clearBoundingBox({ map, layerType: "hover" });
          ActionRotateElement.destroy(map);
        }
        ActionBoundingBox.drawBoundingBox({
          feature: targetPolygon,
          map,
          layerType: "selected",
        });
        ActionHandleDragging.newHandlesPoint(map, targetPolygon);

        requestAnimationFrame(() => {
          handleMoveElement({ map, feature, sourceId });
        });

        ActionHandleDragging.dragHandlesPoint(map);
      }
    });
  }
}
