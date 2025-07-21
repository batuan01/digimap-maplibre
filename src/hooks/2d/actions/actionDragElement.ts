import { AppGlobals } from "@/lib/appGlobals";
import * as turf from "@turf/turf";
import { isImageElement, isLineElement } from "../element/typeChecks";
import { ActionSetData } from "./actionSetData";
import { ActionLoadImage } from "./actionLoadImage";
import { ActionHandleDragging } from "./actionHandleDragging";
import { ActionBoundingBox } from "./actionBoundingBox";
import { ActionRotateElement } from "./actionRotateElement";
import { LngLat, Map, MapMouseEvent } from "maplibre-gl";
import { Area, FeatureType } from "@/types/featureTypes";
import { getCoordinates } from "../element/getDataElement";
import { Position } from "geojson";

/**
 * Kéo polygon theo con trỏ – mượt 60 fps
 * @param {maplibregl.Map}  map
 * @param {GeoJSON.Feature} feature    Polygon cần kéo
 * @param {(feat)=>void}    onUpdate   Callback (gọi setData) mỗi frame
 * @returns {Function}      cleanup()  Huỷ listener khi không cần nữa
 */

interface PropsMoveElement {
  map: Map | null;
  feature: FeatureType;
  sourceId: string;
}

export class ActionDragElement {
  static dragElement(
    map: Map,
    feature: FeatureType,
    onUpdate: (data: FeatureType) => void
  ) {
    /* --------------------------------------------------------------------- */
    // State tạm
    let isDragging = false;
    let isMove = false;
    let startLngLat: LngLat | null = null; // vị trí chuột lúc Mousedown
    const stored = AppGlobals.getElements();
    if (!stored) return;

    let currentFeature: any = feature;

    // Offset (độ) tính từ vị trí bắt đầu
    let dx = 0,
      dy = 0;
    let rafId: number | null = null;

    /* --------------------------------------------------------------------- */
    /** Dựng polygon đã di chuyển theo offset hiện tại */
    const buildMoved = (): any => {
      const original = AppGlobals.getElements().find(
        (f) => f.properties?.id === feature.id
      );
      if (!original) return feature;

      let coords = getCoordinates(original.geometry);

      // Đảm bảo coords luôn là mảng 2 chiều
      const normalizedCoords = (
        isLineElement(currentFeature) || isImageElement(currentFeature)
          ? [coords]
          : coords
      ) as Position[][];

      const movedCoords = normalizedCoords.map((ring) =>
        ring.map(([lng, lat]) => [lng + dx, lat + dy])
      );

      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates:
            isLineElement(currentFeature) || isImageElement(currentFeature)
              ? movedCoords[0]
              : movedCoords,
        },
      };
    };

    /** Render đúng 1 lần / frame */
    const render = () => {
      const moved = buildMoved();
      currentFeature = moved; // ✅ lưu polygon mới nhất
      onUpdate(moved);

      rafId = null;
    };

    /* --------------------------------------------------------------------- */
    // Handlers
    const onMouseDown = (e: MapMouseEvent) => {
      const point = turf.point([e.lngLat.lng, e.lngLat.lat]);
      const geomType = currentFeature.geometry.type;

      if (map.getLayer("handles-layer")) {
        const featuresHandles = map.queryRenderedFeatures(e.point, {
          layers: ["handles-layer"],
        });

        if (featuresHandles.length) return;
      }

      let isInside = false;

      switch (geomType) {
        case "Polygon":
          isInside = turf.booleanPointInPolygon(point, currentFeature);
          break;

        case "LineString": {
          const distance = turf.pointToLineDistance(point, currentFeature, {
            units: "meters",
          });
          isInside = distance < 5;
          break;
        }

        case "Point": {
          const distance = turf.distance(point, currentFeature, {
            units: "meters",
          });
          isInside = distance < 5;
          break;
        }

        case "Image": {
          const polygon = ActionLoadImage.convertPoligon(feature);
          isInside = turf.booleanPointInPolygon(point, polygon);
          break;
        }

        default:
          isInside = false;
          break;
      }

      if (!isInside) return;

      ActionHandleDragging.removeHandlesPoint(map);
      ActionBoundingBox.clearBoundingBox(map, "selected");
      ActionBoundingBox.clearBoundingBox(map, "hover");
      ActionRotateElement.destroy(map);

      isDragging = true;
      startLngLat = e.lngLat;

      map.getCanvas().style.cursor = "move";
      map.dragPan.disable();
    };

    const onMouseMove = (e: MapMouseEvent) => {
      if (!isDragging || !startLngLat) return;

      // Tính offset so với vị trí mousedown
      dx = e.lngLat.lng - startLngLat.lng;
      dy = e.lngLat.lat - startLngLat.lat;

      // Đảm bảo setData tối đa 1 lần / frame
      if (!rafId) rafId = requestAnimationFrame(render);
      isMove = true;
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;

      // Bắt buộc render frame cuối cùng nếu còn treo
      if (rafId) {
        cancelAnimationFrame(rafId);
        render();
      }

      map.getCanvas().style.cursor = "";
      map.dragPan.enable();

      if (isMove) {
        // ---------------- Lưu kết quả ----------------
        const feature = isImageElement(currentFeature)
          ? ActionLoadImage.convertPoligon(currentFeature)
          : currentFeature;

        ActionBoundingBox.drawBoundingBox(feature, map, "selected");
        AppGlobals.setDataToStore(currentFeature);
        ActionHandleDragging.newHandlesPoint(map, currentFeature);
        ActionRotateElement.addHandle(map, currentFeature);

        isMove = false;
      }

      // Reset biến tạm
      startLngLat = null;
      isDragging = false;
      dx = dy = 0;
    };

    /* --------------------------------------------------------------------- */
    // Gắn / gỡ listener
    map.on("mousedown", onMouseDown);
    map.on("mousemove", onMouseMove);
    map.on("mouseup", onMouseUp);

    return () => {
      map.off("mousedown", onMouseDown);
      map.off("mousemove", onMouseMove);
      map.off("mouseup", onMouseUp);
    };
  }

  static handleMoveElement = ({ map, feature, sourceId }: PropsMoveElement) => {
    if (!feature || !map) return;

    try {
      this.dragElement(map, feature, (movedFeature) => {
        ActionSetData.setSelectedData(map, movedFeature, sourceId);
      });
    } catch (error) {
      console.log(error);
    }
  };
}
