import { ZOOM_OVERVIEW } from "@/constants/mapConfig";
import { getCoordinates } from "@/hooks/2d/element/getDataElement";
import {
  isImageElement,
  isPolygonElement,
} from "@/hooks/2d/element/typeChecks";
import { FeatureType, LonLat } from "@/types/featureTypes";
import * as turf from "@turf/turf";
import { Feature, Point } from "geojson";
import { Map } from "maplibre-gl";

export class ActionConvertData {
  static filerZoomLayers(map: Map, data: FeatureType[]) {
    if (!data.length) return [];
    const zoom = map.getZoom();

    const overviewFeatures = this.dataOverview(data);
    const detailFeatures = this.dataDetail(data);

    if (overviewFeatures.length === 0) return data;
    const features = zoom < ZOOM_OVERVIEW ? overviewFeatures : detailFeatures;

    return features;
  }

  static dataOverview(data: FeatureType[]) {
    if (!data.length) return [];
    return data.filter((f) => f.properties?.layer === "overview");
  }

  static dataDetail(data: FeatureType[]) {
    if (!data.length) return [];
    return data.filter((f) => f.properties?.layer !== "overview");
  }

  static filterPolygonElements(data: FeatureType[]) {
    if (!data.length) return [];

    return data.filter((f) => isPolygonElement(f));
  }

  static filterImageElements(data: FeatureType[]) {
    if (!data.length) return [];
    return data.filter((f) => isImageElement(f));
  }

  static convertLabel(polygonFeatures: FeatureType[]) {
    if (!polygonFeatures.length) return [];

    return polygonFeatures.map((poly) => {
      const center = turf.centroid(poly);
      return {
        ...poly,
        geometry: center.geometry,
      };
    });
  }

  static convertMultiLineToLine(pathElement: FeatureType) {
    const lineStrings = getCoordinates(pathElement.geometry)?.map((line) => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: line,
      },
      properties: {},
    }));

    return {
      type: "FeatureCollection",
      features: lineStrings,
    };
  }
}