import { AppGlobals } from "@/lib/appGlobals";
import { ActionBoundingBox } from "./actionBoundingBox";
import { LayerActions } from "./actionLayer";
import { ActionSetData } from "./actionSetData";
import { ActionLoadImage } from "./actionLoadImage";
import { isImageElement } from "../element/typeChecks";
import { FeatureType } from "@/types/featureTypes";
import { Position } from "geojson";
import { Map, MapGeoJSONFeature } from "maplibre-gl";

export class ActionHandleDragging {
  static getCornerHandles(feature: FeatureType): FeatureType[] {
    if (!feature?.geometry) return [];

    switch (feature.properties?.type) {
      case "Polygon": {
        const coordinates = feature.geometry.coordinates as Position[][];
        const points = coordinates[0].slice(0, -1); // bỏ điểm đóng vòng
        return points.map((coord, idx) => ({
          type: "Feature",
          id: `${feature.id}-handle-${idx}`,
          geometry: { type: "Point", coordinates: coord },
          properties: { type: "handle", parentId: feature.id, index: idx },
        }));
      }

      case "Image": {
        const coordinates = feature.geometry.coordinates as any;

        let firstCoords: Position[] | Position | null = null;

        if (
          Array.isArray(coordinates) &&
          Array.isArray(coordinates[0]) &&
          Array.isArray(coordinates[0][0])
        ) {
          // Kiểu Position[][] → lấy phần tử đầu tiên
          firstCoords = coordinates[0] as Position[];
        } else {
          // Kiểu Position[] → dùng trực tiếp
          firstCoords = coordinates as Position[];
        }

        let points = [...firstCoords];
        const lastPoint = points.at(-1);
        if (
          points.length &&
          lastPoint &&
          (points[0][0] !== lastPoint[0] || points[0][1] !== lastPoint[1])
        ) {
          points.push(points[0]);
        }

        return points.slice(0, -1).map((coord, idx) => ({
          type: "Feature",
          id: `${feature.id}-handle-${idx}`,
          geometry: { type: "Point", coordinates: coord },
          properties: { type: "handle", parentId: feature.id, index: idx },
        }));
      }

      case "LineString": {
        const coordinates = feature.geometry.coordinates as Position[];
        const points = coordinates;
        return points.map((coord, idx) => ({
          type: "Feature",
          id: `${feature.id}-handle-${idx}`,
          geometry: { type: "Point", coordinates: coord },
          properties: { type: "handle", parentId: feature.id, index: idx },
        }));
      }

      case "MultiLineString": {
        const coordinates = feature.geometry.coordinates as Position[][];
        return coordinates.flatMap((line, lineIndex) =>
          line.map((coord, pointIndex) => ({
            type: "Feature",
            id: `${feature.id}-handle-${lineIndex}-${pointIndex}`,
            geometry: { type: "Point", coordinates: coord },
            properties: {
              type: "handle",
              parentId: feature.id,
              index: { lineIndex, pointIndex },
            },
          }))
        );
      }

      case "Point": {
        const coordinates = feature.geometry.coordinates as Position;
        return [
          {
            type: "Feature",
            id: `${feature.id}-handle-0`,
            geometry: { type: "Point", coordinates },
            properties: { type: "handle", parentId: feature.id, index: 0 },
          },
        ];
      }

      default:
        return [];
    }
  }

  static enableHandleDragging(
    map: Map,
    onUpdateFeature: (data: FeatureType) => void
  ) {
    let selectedHandle: MapGeoJSONFeature | null = null;
    let isDragging = false;
    let animationFrameId: number | null = null;
    let latestCoord: Position | null = null;
    let currentFeature: FeatureType | null = null;

    map.on("mousedown", (e) => {
      if (!map.getLayer("handles-layer")) return;
      map.dragPan.disable();

      const features = map.queryRenderedFeatures(e.point, {
        layers: ["handles-layer"],
      });

      if (features.length && features[0].properties?.type === "handle") {
        selectedHandle = features[0];
        isDragging = true;
        map.getCanvas().style.cursor = "grabbing";

        ActionBoundingBox.clearBoundingBox(map, "selected");
      }
    });

    const update = () => {
      if (!isDragging || !selectedHandle || !latestCoord) return;

      const { parentId, index } = selectedHandle.properties;
      const allFeatures = AppGlobals.getElements();
      const targetFeature = allFeatures.find((f) => f.id === parentId);
      if (!targetFeature) return;

      const geometryType = targetFeature.geometry.type;

      switch (targetFeature.properties?.type) {
        case "Polygon": {
          if (geometryType !== "Polygon") return;
          const coords = [...targetFeature.geometry.coordinates[0]];
          coords[index] = latestCoord;
          coords[coords.length - 1] = coords[0]; // đóng vòng
          targetFeature.geometry.coordinates = [coords];
          break;
        }

        case "Image": {
          // const coords = [
          //   ...(targetFeature.geometry.coordinates as Position[]),
          // ];
          const coords = [...targetFeature.geometry.coordinates] as any;
          coords[index] = latestCoord;
          targetFeature.geometry.coordinates = coords;
          break;
        }

        case "LineString": {
          if (geometryType !== "LineString") return;
          const coords = [...targetFeature.geometry.coordinates];
          coords[index] = latestCoord;
          targetFeature.geometry.coordinates = coords;
          break;
        }

        case "MultiLineString": {
          if (geometryType !== "MultiLineString") return;
          const indexRaw = selectedHandle.properties.index;
          let index = JSON.parse(indexRaw);

          if (
            !index ||
            typeof index.lineIndex !== "number" ||
            typeof index.pointIndex !== "number"
          )
            return;

          const multiCoords = [...targetFeature.geometry.coordinates];
          const lineCoords = [...multiCoords[index.lineIndex]];
          const coordToUpdate = lineCoords[index.pointIndex];

          // Cập nhật tọa độ cần sửa
          lineCoords[index.pointIndex] = latestCoord;

          // Cập nhật tất cả các tọa độ trùng khớp
          for (let i = 0; i < multiCoords.length; i++) {
            for (let j = 0; j < multiCoords[i].length; j++) {
              if (
                JSON.stringify(multiCoords[i][j]) ===
                JSON.stringify(coordToUpdate)
              ) {
                multiCoords[i][j] = latestCoord;
              }
            }
          }

          // Cập nhật lại tọa độ trong targetFeature
          multiCoords[index.lineIndex] = lineCoords;
          targetFeature.geometry.coordinates = multiCoords;
          break;
        }

        default:
          console.warn(
            "Unsupported geometry type:",
            targetFeature.geometry.type
          );
          return;
      }

      onUpdateFeature(targetFeature);
      animationFrameId = null;
      currentFeature = targetFeature;
    };

    map.on("mousemove", (e) => {
      if (!isDragging || !selectedHandle) return;

      latestCoord = [e.lngLat.lng, e.lngLat.lat];

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(update);
      }
    });

    map.on("mouseup", () => {
      if (!isDragging) return;

      isDragging = false;
      selectedHandle = null;
      map.getCanvas().style.cursor = "";
      map.dragPan.enable();

      // Cancel frame nếu còn
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      if (!currentFeature) return;

      const feature = isImageElement(currentFeature)
        ? ActionLoadImage.convertPoligon(currentFeature)
        : currentFeature;

      update();
      AppGlobals.setDataToStore(currentFeature); // ✅ lưu polygon mới nhất()
      ActionBoundingBox.drawBoundingBox(feature, map, "selected");
    });
  }

  static addHandlesPoint = (map: Map, handles: FeatureType[]) => {
    if (!map.getSource("handles-source")) {
      map.addSource("handles-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: handles,
        },
      });
    }

    if (!map.getLayer("handles-layer")) {
      map.addLayer({
        id: "handles-layer",
        type: "circle",
        source: "handles-source",
        paint: {
          "circle-radius": 8,
          "circle-color": "#ffffff", // Nền trắng
          "circle-stroke-color": "#007aff", // Viền xanh (blue iOS)
          "circle-stroke-width": 2,
        },
      });
    }
  };

  static newHandlesPoint = (map: Map, feature: FeatureType) => {
    if (!feature || !feature.id) return;

    const handles = this.getCornerHandles(feature);
    if (!handles.length) return;
    this.removeHandlesPoint(map);
    this.addHandlesPoint(map, handles);
  };

  static removeHandlesPoint = (map: Map) => {
    const sourceId = "handles-source";
    const layerId = "handles-layer";

    LayerActions.remove(map, sourceId, layerId);
  };

  static dragHandlesPoint = (map: Map) => {
    this.enableHandleDragging(map, (updatedFeature) => {
      const sourceId = LayerActions.findFeatureSourceId(map, updatedFeature);
      // Cập nhật lại feature trong localStorage
      ActionSetData.setSelectedData(map, updatedFeature, sourceId);

      // Cập nhật lại handles
      ActionSetData.setHandlesData(map, updatedFeature);
    });
  };
}
