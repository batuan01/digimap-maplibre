import { Map } from "maplibre-gl";
import { ActionConvertData } from "./actionConvertData";
import { FeatureType } from "@/types/featureTypes";
import {
  ActionLoadData2D,
  GroupFeature,
} from "@/hooks/2d/actions/actionLoadData2D";
import { AppGlobals } from "@/lib/appGlobals";
import { ActionLoadLabel } from "./actionLoadLabel";
import { ZOOM_OVERVIEW } from "@/constants/mapConfig";
import { LayerActions } from "@/hooks/2d/actions/actionLayer";

interface FeatureGroup {
  type: string;
  features: FeatureType[];
}

export class ActionLoadData3D {
  static updateElementsByZoom(map: Map, data: FeatureGroup) {
    const zoom = map.getZoom();
    const zoomFeatures = ActionConvertData.filerZoomLayers(map, data.features);

    const dataOverview = ActionConvertData.dataOverview(data.features);
    const dataDetail = ActionConvertData.dataDetail(data.features);

    const splitOverview = ActionLoadData2D.splitFeatureGroups(dataOverview);
    const splitDetail = ActionLoadData2D.splitFeatureGroups(dataDetail);
    const splitZoom = ActionLoadData2D.splitFeatureGroups(zoomFeatures);

    const beforeLayerId = map.getLayer("layer-labels-text")
      ? "layer-labels-text"
      : "";

    // Thêm các khối chính (polygon hoặc image)
    splitZoom.forEach((group) => {
      this.AddFeature3D(group, map, group.features[0].id, beforeLayerId);
    });

    // cap nhật data hien tai
    AppGlobals.setElements(zoomFeatures);

    // Cập nhật label
    ActionLoadLabel.textLabels(map);
    ActionLoadLabel.imageLabels(map);

    // Cập nhật source label (text/image)
    const labelFeatures = ActionConvertData.convertLabel(
      ActionConvertData.filterPolygonElements(zoomFeatures)
    ) as FeatureType[];
    this.updateLabelSource(map, "source-labels-text", labelFeatures);
    this.updateLabelSource(map, "source-labels-image", labelFeatures);

    if (splitOverview.length == 0) return;

    // Ẩn hoặc xoá layer/source dựa theo zoom
    const groupsToRemove = zoom > ZOOM_OVERVIEW ? splitOverview : splitDetail;
    console.log("groupsToRemove", groupsToRemove);
    groupsToRemove.forEach((group) => {
      const id = group.features[0].id;
      LayerActions.remove(map, `source-${id}`, `layer-${id}`);
    });
  }

  static AddFeature3D(
    group: GroupFeature,
    map: Map,
    id: string,
    beforeLayerId = ""
  ) {
    const sourceId = `source-${id}`;
    const layerId = `layer-${id}`;

    // Tránh tạo trùng
    if (map.getLayer(layerId) || map.getSource(sourceId)) return;

    const geometryType = group.sourceType;

    if (geometryType === "Polygon") {
      map.addSource(sourceId, {
        type: "geojson",
        data: group as any,
      });

      map.addLayer(
        {
          id: layerId,
          type: "fill-extrusion",
          source: sourceId,
          paint: {
            "fill-extrusion-color": ["get", "color"],
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": 1,
          },
        },
        beforeLayerId
      );
    } else if (geometryType === "Image") {
      ActionLoadData2D.AddFeature({
        features: group,
        map,
        index: id,
        beforeLayerId,
      });
    }
  }

  static updateLabelSource(
    map: Map,
    sourceId: string,
    features: FeatureType[]
  ) {
    const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
    if (source) {
      source.setData({
        type: "FeatureCollection",
        features: features as any,
      });
    }
  }
}
