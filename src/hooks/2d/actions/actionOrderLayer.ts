import { AppGlobals } from "@/lib/appGlobals";
import { LayerActions } from "./actionLayer";
import { generateUUID } from "@/constants/mapConfig";
import { isImageElement } from "../element/typeChecks";
import { ActionLoadData2D } from "./actionLoadData2D";
import { Map } from "maplibre-gl";
import { FeatureType, GroupFeatureType } from "@/types/featureTypes";
import {
  getFeaturesBySource,
  getSourceElement,
} from "../element/getDataElement";

export class ActionOrderLayer {
  static bringForward(map: Map, feature: FeatureType) {
    this.moveLayer(map, feature, "forward");
  }

  static sendBackward(map: Map, feature: FeatureType) {
    this.moveLayer(map, feature, "backward");
  }

  static moveFeature(
    map: Map,
    feature: FeatureType,
    fromSourceId: string,
    toSourceId: string,
    direction: "forward" | "backward",
    currentLayerId: string[]
  ) {
    const fromSource = getSourceElement(map, fromSourceId);
    const toSource = getSourceElement(map, toSourceId);

    const fromFeaturesData = getFeaturesBySource(fromSource);
    const toFeaturesData = getFeaturesBySource(toSource);

    if (fromFeaturesData.length === 0 || toFeaturesData.length === 0) return;

    const newFrom = fromFeaturesData.filter((f) => f.id !== feature.id);
    const newTo =
      direction === "forward"
        ? [feature, ...toFeaturesData]
        : [...toFeaturesData, feature];

    fromSource.setData({ type: "FeatureCollection", features: newFrom });
    toSource.setData({ type: "FeatureCollection", features: newTo });

    // Nếu source cũ không còn feature nào → xóa
    if (newFrom.length === 0) {
      for (const layer of currentLayerId) {
        LayerActions.removeLayer(map, layer);
      }

      if (map.getSource(fromSourceId)) map.removeSource(fromSourceId);
    }
  }

  static moveLayer = (
    map: Map,
    feature: FeatureType,
    direction: "forward" | "backward"
  ) => {
    const currentSourceId = LayerActions.findFeatureSourceId(map, feature);
    const currentLayerId = LayerActions.findFeatureLayerId(map, feature);

    if (!currentSourceId || !currentLayerId.length) return;

    const storedData = AppGlobals.getElements();
    const isAtBottom = storedData[0]?.id === feature.id;
    const isAtTop = storedData[storedData.length - 1]?.id === feature.id;

    if (
      (direction === "forward" && isAtTop) ||
      (direction === "backward" && isAtBottom)
    ) {
      // Feature đã nằm trên cùng hoặc dưới cùng → không làm gì
      return;
    }

    const source = getSourceElement(map, currentSourceId);
    const features = getFeaturesBySource(source);

    const index = features.findIndex((f) => f.id === feature.id);
    const delta = direction === "forward" ? 1 : -1;
    const newIndex = index + delta;

    // Nếu có thể di chuyển trong cùng 1 source
    if (newIndex >= 0 && newIndex < features.length) {
      const reordered = [...features];
      const temp = reordered[index];
      reordered[index] = reordered[newIndex];
      reordered[newIndex] = temp;

      const fromFeature = LayerActions.findFeatureLayerId(
        map,
        reordered[index]
      );
      const toFeature = LayerActions.findFeatureLayerId(
        map,
        reordered[newIndex]
      );

      if (map.getLayer(fromFeature[1]) && map.getLayer(toFeature[1])) {
        if (direction === "forward") {
          map.moveLayer(fromFeature[1], toFeature[1]);
        } else {
          map.moveLayer(toFeature[1], fromFeature[1]);
        }
      }

      source.setData({
        type: "FeatureCollection",
        features: reordered,
      });

      AppGlobals.updateDataStoreByIds(
        reordered[index].id,
        reordered[newIndex].id
      );
      return;
    }

    const relativeFeature = AppGlobals.getAdjacentFeature(feature, direction);
    if (!relativeFeature) return;
    const relativeSourceId = LayerActions.findFeatureSourceId(
      map,
      relativeFeature
    );
    if (!relativeSourceId) return;

    const newFeature = (feature: FeatureType, index: number) => {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          index: index ? index : feature.properties?.index,
        },
      };
    };

    const newFeatureCollection = (
      feature: FeatureType,
      index: number
    ): GroupFeatureType => {
      return {
        type: "FeatureCollection",
        sourceType: feature.geometry.type,
        features: [newFeature(feature, index)],
      };
    };

    const newIndexIncrease = AppGlobals.getMaxIndex() + 1;
    const newId = generateUUID();

    if (isImageElement(relativeFeature)) {
      const aboveFeature = AppGlobals.getAdjacentFeature(
        relativeFeature,
        direction
      );
      if (!aboveFeature) return;
      const aboveSourceId = LayerActions.findFeatureSourceId(map, aboveFeature);
      if (!aboveSourceId) return;

      const beforeLayerId =
        direction === "forward"
          ? aboveSourceId
            ? `layer-${aboveSourceId.replace("source-", "")}`
            : ""
          : `layer-${relativeSourceId.replace("source-", "")}`;

      if (aboveFeature?.geometry.type === feature.geometry.type) {
        this.moveFeature(
          map,
          feature,
          currentSourceId,
          aboveSourceId,
          direction,
          currentLayerId
        );
        AppGlobals.updateDataStoreByIds(relativeFeature.id, feature.id);
      } else {
        if (relativeFeature.properties?.index === AppGlobals.getMaxIndex()) {
          if (isImageElement(feature)) {
            this.removeLayer(map, feature.id);
          }

          ActionLoadData2D.AddFeature(
            newFeatureCollection(feature, newIndexIncrease),
            map,
            newId,
            beforeLayerId
          );

          AppGlobals.removeDataById(feature.id);
          AppGlobals.setDataToStore(newFeature(feature, newIndexIncrease));
        } else {
          if (isImageElement(feature)) {
            this.removeLayer(map, feature.id);
          }

          ActionLoadData2D.AddFeature(
            newFeatureCollection(feature, relativeFeature.properties?.index),
            map,
            newId,
            beforeLayerId
          );
          AppGlobals.updateDataStoreByIds(relativeFeature.id, feature.id);
        }
        this.updateDataAftermove(map, feature, currentSourceId);
      }
    } else {
      const isForward = direction === "forward";
      const newFeature = AppGlobals.getAdjacentFeature(
        feature,
        isForward ? "backward" : "forward"
      );

      const isSameType =
        newFeature &&
        newFeature.geometry.type === relativeFeature.geometry.type;

      if (isSameType) {
        const targetSourceId = LayerActions.findFeatureSourceId(
          map,
          newFeature
        );
        const source = getSourceElement(map, targetSourceId!);
        const features = getFeaturesBySource(source);

        const reordered = isForward
          ? [...features, relativeFeature]
          : [relativeFeature, ...features];

        this.updateDataAftermove(map, relativeFeature, relativeSourceId);

        source.setData({
          type: "FeatureCollection",
          features: reordered,
        });
      } else {
        if (isImageElement(relativeFeature)) {
          this.removeLayer(map, relativeFeature.id);
        }

        const layerId = isForward
          ? currentLayerId[0]
          : newFeature
          ? LayerActions.findFeatureLayerId(map, newFeature)?.[0]
          : "";

        ActionLoadData2D.AddFeature(
          newFeatureCollection(relativeFeature, feature.properties?.index),
          map,
          newId,
          layerId
        );

        this.updateDataAftermove(map, relativeFeature, relativeSourceId);
      }

      AppGlobals.updateDataStoreByIds(relativeFeature.id, feature.id);
    }
  };

  static removeLayer(map: Map, layerId: string | number | undefined) {
    if (!layerId) return;
    const currentLayerId = [`layer-${layerId}`, `layer-outline-${layerId}`];
    const currentSourceId = `source-${layerId}`;

    for (const layer of currentLayerId) {
      LayerActions.removeLayer(map, layer);
    }
    LayerActions.removeSource(map, currentSourceId);
  }

  static updateDataAftermove(
    map: Map,
    feature: FeatureType,
    currentSourceId: string
  ) {
    if (!isImageElement(feature)) {
      const fromSource = getSourceElement(map, currentSourceId);
      if (!fromSource) return;
      const features = getFeaturesBySource(fromSource);
      if (features.length == 0) return;
      const newFrom = features.filter((f) => f.id !== feature.id);

      if (newFrom.length === 0) {
        const idLayer = currentSourceId.replace("source-", "");
        this.removeLayer(map, idLayer);
      }
      fromSource.setData({
        type: "FeatureCollection",
        features: newFrom,
      });
    }
  }
}
