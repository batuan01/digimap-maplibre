import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import { GeoJSONSource, LayerSpecification, Map } from "maplibre-gl";
import { RefObject } from "react";
import { ActionLoadData2D, GroupFeature } from "./actionLoadData2D";
import { isPathElement } from "../element/typeChecks";
import {
  loadFromLocalStorage,
  newDataToLocalStorage,
  saveToLocalStorage,
  updateFeatureInLocalStorage,
} from "@/lib/localStorageUtils";
import { AppGlobals } from "@/lib/appGlobals";
import { generateUUID } from "@/constants/mapConfig";
import { DistanceElement } from "../element/distanceElement";
import type {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
  Position,
} from "geojson";
import { LonLat, Path, FeatureType } from "@/types/featureTypes";
import { getCoordinates } from "../element/getDataElement";

interface Props {
  map: Map | null;
  drawRef: RefObject<any>; // MaplibreTerradrawControl | null if available
  isPathRef: RefObject<boolean>;
}

interface LoadDataProps {
  draw: MaplibreTerradrawControl; // MaplibreTerradrawControl
  map: Map;
  isPathRef: RefObject<boolean>;
}

interface StartPointPathType {
  point: [number, number];
  segment: [number, number][];
}

export class ActionDrawElement {
  static Terradraw = ({ map, drawRef, isPathRef }: Props): void => {
    if (!map || !drawRef) return;
    map.on("load", () => {
      const draw = new MaplibreTerradrawControl();

      map.addControl(draw);
      drawRef.current = draw;

      // 🔁 Lắng nghe thay đổi và tự động lưu
      this.SaveAndLoadData({ draw, map, isPathRef });
      this.SaveAndLoadPath({ draw, map, isPathRef });

      // 🔁 Lắng nghe thay đổi màu
      ActionLoadData2D.LoadColor(map);
    });
  };

  static getLastSourceInfo = (
    map: Map
  ): { layerId: string; sourceId: string } | null => {
    const layers = map.getStyle().layers || [];

    const layerWithSources = layers
      .filter((l): l is LayerSpecification & { source: string } => {
        return (
          l.id.startsWith("layer-") &&
          "source" in l &&
          typeof l.source === "string"
        );
      })
      .map((l) => ({
        layerId: l.id,
        sourceId: l.source,
      }));

    return layerWithSources.length
      ? layerWithSources[layerWithSources.length - 1]
      : null;
  };

  static findSourceWithPathType(map: Map): string | null {
    if (!map || !map.getStyle()?.sources) return null;

    const allSources = Object.keys(map.getStyle().sources).filter((id) =>
      id.startsWith("source-")
    );

    for (const sourceId of allSources) {
      const source = map.getSource(sourceId);

      // Đảm bảo là GeoJSONSource
      if (!source || (source.type !== "geojson" && !(source as any).getData))
        continue;

      const geojsonSource = source as GeoJSONSource;

      // Lấy dữ liệu GeoJSON hiện tại
      const data = geojsonSource.getData?.();
      const features = (data as any)?.features;

      if (!features?.length) continue;

      const found = features.find((f: any) => isPathElement(f));
      if (found) return sourceId;
    }

    return null;
  }

  static SaveAndLoadData = ({ draw, map, isPathRef }: LoadDataProps): void => {
    const terraDraw = draw.getTerraDrawInstance();

    terraDraw.on("finish", () => {
      if (isPathRef.current) return;

      const drawFeatures = draw.getFeatures().features;
      let geojson = loadFromLocalStorage();
      if (!geojson) {
        geojson = {
          type: "FeatureCollection",
          features: [],
        };
      }

      const featuresNotAvailable = drawFeatures.filter(
        (item) => !geojson.features.some((bItem: any) => bItem.id === item.id)
      );

      const newIndex = AppGlobals.getMaxIndex() + 1;

      const updatedFeatures = featuresNotAvailable.map((f) => ({
        ...f,
        properties: {
          ...f.properties,
          id: f.id,
          color: f.properties?.color ?? "#787878",
          height: f.properties?.height ?? 0,
          label: f.properties?.label ?? "",
          index: newIndex,
          layer: f.properties?.layer ?? "",
          type: f.geometry?.type ?? "",
        },
      }));

      const allFeatures = [...geojson.features, ...updatedFeatures];

      // 👉 Chỉ add nếu chưa có
      const lastSourceInfo = this.getLastSourceInfo(map);

      const lastSource = lastSourceInfo
        ? (map.getSource(lastSourceInfo.sourceId) as GeoJSONSource)
        : null;

      const currentData = lastSource?._data || lastSource?._options?.data;

      // Đảm bảo currentData không phải là string trước khi truy cập .features
      const currentFeatures: Feature<Geometry, GeoJsonProperties>[] =
        typeof currentData !== "string" &&
        currentData?.type === "FeatureCollection"
          ? currentData.features
          : [];

      updatedFeatures.forEach((f) => {
        // Nếu có source cuối và cùng loại geometry → append vào source đó
        if (
          lastSource &&
          currentFeatures.length > 0 &&
          currentFeatures[0].geometry.type === f.geometry.type
        ) {
          const merged: FeatureCollection<Geometry, GeoJsonProperties> = {
            type: "FeatureCollection",
            features: [...currentFeatures, f],
          };
          lastSource.setData(merged);
        } else {
          const index = generateUUID();
          const geojson = {
            type: "FeatureCollection",
            sourceType: f.geometry.type,
            features: [f],
          } as GroupFeature;
          // Tạo source mới
          ActionLoadData2D.AddFeature({ features: geojson, map, index });
        }
      });

      terraDraw.clear();
      // terraDraw.stop();

      AppGlobals.setDataToStore(updatedFeatures[0]);

      saveToLocalStorage({
        type: "FeatureCollection",
        features: allFeatures,
      });
    });
  };

  static SaveAndLoadPath = ({ draw, map, isPathRef }: LoadDataProps): void => {
    const terraDraw = draw.getTerraDrawInstance();

    let startPointPath: StartPointPathType | null = null;

    terraDraw.on("change", () => {
      if (!isPathRef.current) return;

      const all = draw.getFeatures().features;
      const current = all.find((f) => f.geometry.type === "LineString");
      const pathSourceInfo = this.findSourceWithPathType(map);
      const lastSource = pathSourceInfo
        ? (map.getSource(pathSourceInfo) as GeoJSONSource)
        : null;

      if (!current || !lastSource) return;
      const coords = current.geometry.coordinates;

      const sourceData = lastSource._data || lastSource._options?.data;
      const coordinatesElementPath =
        typeof sourceData !== "string" &&
        sourceData?.type === "FeatureCollection"
          ? getCoordinates(sourceData?.features?.[0].geometry)
          : [];

      // 👉 Khi user mới click 1 điểm (bắt đầu vẽ)
      if (coords.length > 0) {
        const startPoint = coords[0];

        // const distance = 0.00005;
        const zoom = map.getZoom();
        const distance = 0.005 / Math.pow(2, zoom - 10);

        const nearPoint = DistanceElement.isPointNearAnySegment({
          point: startPoint as LonLat,
          lines: coordinatesElementPath as Path[],
          distance,
        });

        if (!nearPoint) {
          setTimeout(() => {
            terraDraw.clear();
          }, 0);
          return;
        }
        // console.log("Có gần đoạn nào không?", nearPoint);
        startPointPath = nearPoint;
      }
    });

    terraDraw.on("finish", () => {
      if (!isPathRef.current) return;

      const drawFeatures = draw.getFeatures().features;
      let geojson = AppGlobals.getElements();

      const featuresNotAvailable = drawFeatures.filter(
        (item) => !geojson.some((bItem) => bItem.id === item.id)
      );

      const newIndex = AppGlobals.getMaxIndex() + 1;

      const updatedFeatures = featuresNotAvailable.map((f) => ({
        ...f,
        properties: {
          ...f.properties,
          id: f.id,
          color: f.properties?.color ?? "#787878",
          height: f.properties?.height ?? 0,
          label: f.properties?.label ?? "",
          index: newIndex,
          layer: f.properties?.layer ?? "",
          type: "Path",
        },
      }));

      // 👉 Chỉ add nếu chưa có
      const pathSourceInfo = this.findSourceWithPathType(map);
      const lastSource = pathSourceInfo
        ? (map.getSource(pathSourceInfo) as GeoJSONSource)
        : null;

      updatedFeatures.forEach((f) => {
        const oldCoordinates = f.geometry.coordinates as Position[];
        if (!lastSource) {
          // 👈 Nếu chưa có source Path, tạo mới
          const index = generateUUID();
          const geojson: GroupFeature = {
            type: "FeatureCollection",
            sourceType: "Path",
            features: [
              {
                ...f,
                geometry: {
                  type: "MultiLineString",
                  coordinates: [oldCoordinates],
                },
                properties: {
                  ...f.properties,
                  mode: "MultiLineString",
                },
              },
            ],
          };
          ActionLoadData2D.AddFeature({ features: geojson, map, index });
          AppGlobals.setDataToStore(geojson.features[0]);
          newDataToLocalStorage(geojson.features[0]);
        } else {
          // 👈 Nếu đã có source Path → thêm đoạn vào MultiLineString hiện tại
          const sourceData = lastSource._data || lastSource._options?.data;
          const feature =
            typeof sourceData !== "string" &&
            sourceData?.type === "FeatureCollection"
              ? sourceData?.features?.[0]
              : undefined;

          if (feature?.geometry?.type === "MultiLineString") {
            if (startPointPath === null) return;
            const [segA, segB] = startPointPath.segment;
            const insertPoint = startPointPath.point;

            // Duyệt qua từng đoạn (LineString con)
            for (const line of feature.geometry.coordinates) {
              const index = line.findIndex((point, i) => {
                if (i === line.length - 1) return false;
                const next = line[i + 1];
                return (
                  (point[0] === segA[0] &&
                    point[1] === segA[1] &&
                    next[0] === segB[0] &&
                    next[1] === segB[1]) ||
                  (point[0] === segB[0] &&
                    point[1] === segB[1] &&
                    next[0] === segA[0] &&
                    next[1] === segA[1])
                );
              });

              if (index !== -1) {
                // Nếu tìm được đoạn phù hợp, chèn điểm vào giữa
                line.splice(index + 1, 0, insertPoint);
                break; // Thoát vòng lặp vì đã thêm xong
              }
            }

            const newCoords = (oldCoordinates as Position[]).slice(1);
            const newCoordinates: Position[] = [insertPoint, ...newCoords];
            feature.geometry.coordinates.push(newCoordinates); // ➕ Add đoạn mới

            // Cập nhật dữ liệu lên map và vào store
            lastSource.setData(
              sourceData as FeatureCollection<Geometry, GeoJsonProperties>
            );
            AppGlobals.setDataToStore(feature);
            updateFeatureInLocalStorage(feature);
          }
        }
      });

      terraDraw.clear();
      // terraDraw.stop();
    });
  };
}
