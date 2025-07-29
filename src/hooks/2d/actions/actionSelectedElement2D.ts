import * as turf from "@turf/turf";
import { isImageElement, isPolygonElement } from "../element/typeChecks";
import { ActionLoadImage } from "./actionLoadImage";
import { AppGlobals } from "@/lib/appGlobals";
import { ActionBoundingBox } from "./actionBoundingBox";
import { ActionHandleDragging } from "./actionHandleDragging";
import { ActionRotateElement } from "./actionRotateElement";
import { ActionRemovePoint } from "./actionRemovePoint";
import { LayerActions } from "./actionLayer";
import { ActionSetData } from "./actionSetData";
import { ActionDragElement } from "./actionDragElement";
import { Map } from "maplibre-gl";
import { FeatureType } from "@/types/featureTypes";
import {
  Feature,
  GeoJsonProperties,
  LineString,
  Point,
  Polygon,
  Position,
} from "geojson";
import { AppState } from "@/types/stateTypes";
import { getSelectedElements } from "../appState";

export class ActionSelectedElement2D {
  static cancelDragging = { cancel: () => {} };

  static findFeatureAtPoint(point: Position, features: FeatureType[]) {
    const clickedPoint = turf.point(point);

    return [...features]
      .sort((a, b) => Number(b.properties?.index) - Number(a.properties?.index))
      .find((feature) => {
        const geom = feature.geometry;
        if (!geom) return false;

        // Polygon & MultiPolygon
        if (geom.type === "Polygon") {
          return turf.booleanPointInPolygon(
            clickedPoint,
            feature as Feature<Polygon, GeoJsonProperties>
          );
        }

        // Custom type "Image" dạng Polygon
        if (isImageElement(feature)) {
          const imagePoly = ActionLoadImage.convertPoligon(feature);
          return turf.booleanPointInPolygon(clickedPoint, imagePoly);
        }

        // LineString
        if (geom.type === "LineString") {
          const distance = turf.pointToLineDistance(
            clickedPoint,
            feature as Feature<LineString, GeoJsonProperties>,
            {
              units: "meters",
            }
          );

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
          const dist = turf.distance(
            clickedPoint,
            feature as Feature<Point, GeoJsonProperties>,
            {
              units: "meters",
            }
          );
          return dist < 5; // Cho phép khoảng cách < 5m là "trúng"
        }

        return false;
      });
  }

  static getSelectedElement({
    map,
    getAppState,
    setAppState,
  }: {
    map: Map;
    getAppState: () => AppState;
    setAppState: (newState: Partial<AppState>) => void;
  }) {
    map.on("click", (e) => {
      const appState = getAppState();
      if (appState.activeTool === "hand") {
        return;
      }

      const clickedLngLat = [e.lngLat.lng, e.lngLat.lat];
      const storedData = AppGlobals.getElements();
      if (!storedData?.length) return;

      const feature = this.findFeatureAtPoint(clickedLngLat, storedData);

      if (feature) {
        setAppState({
          selectedElementIds: [
            ...appState.selectedElementIds,
            feature.properties?.id,
          ],
        });
        const polygonFeature = isImageElement(feature)
          ? ActionLoadImage.convertPoligon(feature)
          : feature;

        const selectedElements = getSelectedElements(appState);

        ActionBoundingBox.drawBoundingBoxMultiple(
          [...selectedElements, polygonFeature],
          map,
          "selected"
        );
        map.dragPan.disable();
      } else {
        setAppState({
          selectedElementIds: [],
        });
        ActionBoundingBox.clearBoundingBox(map, "selected");
        ActionHandleDragging.removeHandlesPoint(map);
        ActionRotateElement.destroy(map);
        map.dragPan.enable();
        this.cancelDragging.cancel();
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

  static getDoubleClickSelection({
    map,
    getAppState,
    setAppState,
  }: {
    map: Map;
    getAppState: () => AppState;
    setAppState: (newState: Partial<AppState>) => void;
  }) {
    map.on("dblclick", (e) => {
      const appState = getAppState();
      if (appState.activeTool === "hand") {
        return;
      }

      e.preventDefault();
      map.dragPan.disable();

      const clickedLngLat = [e.lngLat.lng, e.lngLat.lat];
      const storedData = AppGlobals.getElements();
      if (!storedData?.length) return;

      const feature = this.findFeatureAtPoint(clickedLngLat, storedData);
      if (!feature) return;

      const sourceId = LayerActions.findFeatureSourceId(map, feature);
      if (!sourceId) return;

      setAppState({
        selectedElementIds: [
          ...appState.selectedElementIds,
          feature.properties?.id,
        ],
      });

      const selectedElements = getSelectedElements(appState);

      // Xử lý chuẩn hóa thành Polygon để vẽ bbox và xoay
      let targetPolygon = null;
      switch (feature.properties?.type) {
        case "Polygon":
        case "LineString":
        case "MultiLineString":
        case "Path":
          targetPolygon = feature;
          break;

        case "Image":
          if (isImageElement(feature)) {
            targetPolygon = ActionLoadImage.convertPoligon(feature);
          }
          break;

        case "Point":
          const buffer = turf.buffer(feature, 0.0001, { units: "degrees" });
          if (buffer && isPolygonElement(buffer as FeatureType)) {
            targetPolygon = buffer;
          }
          break;

        default:
          console.warn("Không hỗ trợ type:", feature.geometry.type);
      }

      if (targetPolygon) {
        if (!(targetPolygon.geometry.type === "MultiLineString")) {
          ActionRotateElement.addHandle(map, targetPolygon);

          ActionRotateElement.setup(map, feature);
        } else {
          ActionBoundingBox.clearBoundingBox(map, "selected");
          ActionBoundingBox.clearBoundingBox(map, "hover");
          ActionRotateElement.destroy(map);
        }
        ActionBoundingBox.drawBoundingBoxMultiple(
          [...selectedElements, targetPolygon],
          map,
          "selected"
        );
        ActionHandleDragging.newHandlesPoint(map, targetPolygon);

        ActionDragElement.handleMoveElement({
          map,
          feature,
          sourceId,
          cancelDragging: this.cancelDragging,
        });

        ActionHandleDragging.dragHandlesPoint(map);
      }
    });
  }
}
