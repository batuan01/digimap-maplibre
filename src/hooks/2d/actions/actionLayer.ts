import { FeatureType } from "@/types/featureTypes";
import { Map } from "maplibre-gl";
import {
  getFeaturesBySource,
  getSourceElement,
} from "../element/getDataElement";

export class LayerActions {
  static remove(map: Map, sourceId: string, layerId: string) {
    this.removeLayer(map, layerId);
    this.removeSource(map, sourceId);
  }

  static removeLayer(map: Map, layerId: string) {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
  }

  static removeSource(map: Map, sourceId: string | null) {
    if (!sourceId || !map) return;
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  }

  static findFeatureSourceId(map: Map, feature: FeatureType) {
    if (!feature || !map || Object.keys(map.getStyle().sources).length === 0)
      return null;
    const allSources = Object.keys(map.getStyle().sources).filter((s) =>
      s.startsWith("source-")
    );
    const sourceId = allSources.find((sourceId) => {
      const source = getSourceElement(map, sourceId);
      if (!source) return false;

      if ("type" in source && (source as any).type === "image") {
        const id = source.id.replace("source-", "");
        return feature.id === id;
      }

      const features = getFeaturesBySource(source);
      return features?.some((f: FeatureType) => f.id === feature.id);
    });

    return sourceId ?? null;
  }

  static findFeatureLayerId(map: Map, feature: FeatureType) {
    const layers = map
      .getStyle()
      .layers.filter(
        (l) => l.id.startsWith("layer-") || l.id.startsWith("layer-outline-")
      );

    const currentSourceId = this.findFeatureSourceId(map, feature);

    if (!currentSourceId) return [];

    const id = currentSourceId.replace("source-", "");

    let layerIds: string[] = [];
    for (const layer of layers) {
      let idLayer = layer.id;
      if (idLayer.startsWith("layer-outline-")) {
        idLayer = idLayer.replace("layer-outline-", "");
      } else if (idLayer.startsWith("layer-")) {
        idLayer = idLayer.replace("layer-", "");
      }

      if (idLayer === id && !layerIds.includes(layer.id)) {
        layerIds.push(layer.id);
      }
    }

    return layerIds;
  }
}
