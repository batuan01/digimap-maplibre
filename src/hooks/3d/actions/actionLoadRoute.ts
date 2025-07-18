import { Feature, GeoJsonProperties, Geometry, Position } from "geojson";
import { Map } from "maplibre-gl";

export class ActionLoadRoute {
  static add(map: Map, coordinates: Position[]) {
    const lineFeature = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates,
      },
      properties: {},
    } as Feature<Geometry, GeoJsonProperties>;

    if (!map.getSource("route")) {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [lineFeature],
        },
      });

      map.addLayer({
        id: "route-layer",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff5c5c",
          "line-width": 8,
        },
      });
    } else {
      // Nếu source đã tồn tại thì chỉ update lại
      (map.getSource("route") as maplibregl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: [lineFeature],
      });
    }
  }
}
