import { loadFromLocalStorage } from "@/lib/localStorageUtils";
import { isImageElement, isPathElement } from "../element/typeChecks";
import { AppGlobals } from "@/lib/appGlobals";
import { generateUUID } from "@/constants/mapConfig";
import { Map } from "maplibre-gl";
import { FeatureType, GroupFeatureType } from "@/types/featureTypes";

export class ActionLoadData2D {
  static splitFeatureGroups(features: FeatureType[]): GroupFeatureType[] {
    const result: GroupFeatureType[] = [];
    let current: FeatureType[] = [];

    const allFeatures = features.sort(
      (a, b) => a.properties?.index - b.properties?.index
    );

    for (const f of allFeatures) {
      const isImage = isImageElement(f);
      const isPath = isPathElement(f);

      if (isImage || isPath) {
        // Nếu đang có nhóm đang gom thì push vào trước
        if (current.length) {
          result.push({
            type: "FeatureCollection",
            sourceType: current[0].geometry.type,
            features: current,
          });
          current = [];
        }

        // Thêm riêng Image hoặc Path vào kết quả
        result.push({
          type: "FeatureCollection",
          sourceType: isImage ? "Image" : "Path",
          features: [f],
        });
      } else if (
        !current.length ||
        current[0].geometry.type === f.geometry.type
      ) {
        current.push(f);
      } else {
        result.push({
          type: "FeatureCollection",
          sourceType: current[0].geometry.type,
          features: current,
        });
        current = [f];
      }
    }

    if (current.length) {
      result.push({
        type: "FeatureCollection",
        sourceType: current[0].geometry.type,
        features: current,
      });
    }

    return result;
  }

  static loadDefaultData = (map: Map) => {
    const geojson = loadFromLocalStorage();
    if (!geojson) return;

    const splitGeojson = this.splitFeatureGroups(geojson.features);
    AppGlobals.setElements(geojson.features);

    splitGeojson.forEach((f) => {
      const index = generateUUID();
      this.AddFeature(f, map, index);
    });
  };

  static LoadColor = (map: Map) => {
    const applyColorToDrawLayers = () => {
      const layers = map.getStyle().layers;
      layers
        .filter((l) => l.id.startsWith("td")) // hoặc "terra-draw"
        .forEach(({ id, type }) => {
          try {
            const colorExpr = [
              "case",
              ["==", ["get", "color"], ""],
              "#787878", // nếu color là chuỗi rỗng
              ["!", ["has", "color"]],
              "#787878", // nếu không có color
              ["get", "color"], // ngược lại dùng color trong feature
            ];

            if (type === "fill") {
              map.setPaintProperty(id, "fill-color", colorExpr);
            } else if (type === "line") {
              map.setPaintProperty(id, "line-color", colorExpr);
            } else if (type === "circle") {
              map.setPaintProperty(id, "circle-color", colorExpr);
            }
          } catch (err) {
            console.warn(`⚠️ Không đổi được màu layer ${id}:`, err);
          }
        });
    };

    requestAnimationFrame(() => {
      applyColorToDrawLayers();
    });
  };

  static AddFeature = (
    features: GroupFeatureType,
    map: Map,
    index: string,
    beforeLayerId: string = ""
  ) => {
    const sourceId = `source-${index}`;
    const layerId = `layer-${index}`;
    const outlineId = `layer-outline-${index}`;

    // Nếu đã có thì bỏ qua
    if (map.getLayer(layerId) || map.getSource(sourceId)) return;

    const geometryType = features.sourceType;

    // 👇 TH1: Polygon
    if (geometryType === "Polygon") {
      map.addSource(sourceId, {
        type: "geojson",
        data: features,
      });

      map.addLayer(
        {
          id: layerId,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": ["coalesce", ["get", "color"], "#787878"],
            "fill-opacity": 0.4, // màu nền trong suốt
          },
        },
        beforeLayerId
      );

      // Layer line (viền đen đậm)
      map.addLayer(
        {
          id: outlineId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": "#787878", // viền đen
            "line-width": 4,
            "line-opacity": 1,
          },
        },
        beforeLayerId
      );

      return;
    }

    // 👇 TH2: Image (custom)
    if (geometryType === "Image") {
      const feature = features.features[0]; // ảnh chỉ có 1 feature
      const bounds = feature.geometry.coordinates as any;
      const imageUrl = feature.properties?.imageUrl;
      const imageId = feature.id;

      const sourceIdImage = `source-${imageId}`;
      const layerIdImage = `layer-${imageId}`;

      map.addSource(sourceIdImage, {
        type: "image",
        url: imageUrl,
        coordinates: bounds,
      });

      map.addLayer(
        {
          id: layerIdImage,
          type: "raster",
          source: sourceIdImage,
          paint: {
            "raster-fade-duration": 0,
            "raster-opacity": 1,
          },
        },
        beforeLayerId
      );

      return;
    }

    // 👇 TH3: LineString
    if (geometryType === "LineString") {
      map.addSource(sourceId, {
        type: "geojson",
        data: features,
      });

      map.addLayer(
        {
          id: layerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": ["coalesce", ["get", "color"], "#0066CC"],
            "line-width": ["coalesce", ["get", "width"], 4],
          },
        },
        beforeLayerId
      );

      return;
    }

    if (geometryType === "Path") {
      map.addSource(sourceId, {
        type: "geojson",
        data: features,
      });

      map.addLayer(
        {
          id: layerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": "#1c7ed6",
            "line-width": ["coalesce", ["get", "width"], 4],
          },
        },
        beforeLayerId
      );

      return;
    }

    // 👇 TH4: Point (nếu muốn hỗ trợ)
    if (geometryType === "Point") {
      map.addSource(sourceId, {
        type: "geojson",
        data: features,
      });

      map.addLayer(
        {
          id: layerId,
          type: "circle",
          source: sourceId,
          paint: {
            "circle-color": ["coalesce", ["get", "color"], "#FF0000"],
            "circle-radius": ["coalesce", ["get", "radius"], 6],
          },
        },
        beforeLayerId
      );

      return;
    }
  };
}
