import { AppGlobals } from "@/lib/appGlobals";
import { ActionRemovePoint } from "./actionRemovePoint";
import { ActionHandleDragging } from "./actionHandleDragging";
import { ActionBoundingBox } from "./actionBoundingBox";
import { ActionRotateElement } from "./actionRotateElement";
import { isImageElement } from "../element/typeChecks";
import { ActionOrderLayer } from "./actionOrderLayer";
import { removeFeatureFromLocalStorage } from "@/lib/localStorageUtils";
import { RefObject } from "react";
import { Map } from "maplibre-gl";
import { FeatureType } from "@/types/featureTypes";
import { LayerActions } from "./actionLayer";

export class ActionKeyboard {
  static selectedMultipleElements: FeatureType[] = [];
  static keyDown(
    mapContainer: RefObject<HTMLDivElement | null>,
    mapRef: RefObject<Map | null>,
    selectedElement: FeatureType | null
  ) {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mapEl = mapContainer.current;
      const activeEl = document.activeElement;

      // Chỉ xử lý nếu focus đang nằm trong map container
      if (!mapEl || !mapEl.contains(activeEl)) return;

      // Ctrl + A: chọn tất cả
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        this.selectedMultipleElements = AppGlobals.getElements();
      }

      // Backspace: xóa hết
      if (e.key === "Backspace") {
        e.preventDefault();
        const map = mapRef.current;

        if (!map) return;

        if (ActionRemovePoint.targetPoint) {
          ActionRemovePoint.removeOnlyPoint(map);
          return;
        }

        if (selectedElement) {
          clearAllFeatures(map, [selectedElement]);
          AppGlobals.removeDataById(selectedElement.id as string);
        }

        if (this.selectedMultipleElements.length) {
          clearAllFeatures(map, this.selectedMultipleElements);
          this.selectedMultipleElements = [];
          AppGlobals.setElements([]);
        }

        ActionHandleDragging.removeHandlesPoint(map);
        ActionBoundingBox.clearBoundingBox(map, "selected");
        ActionBoundingBox.clearBoundingBox(map, "hover");
        ActionRotateElement.destroy(map);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }
}

export const clearAllFeatures = (map: Map, features: FeatureType[]) => {
  if (!features.length) return;

  features.forEach((f) => {
    const currentSourceId = LayerActions.findFeatureSourceId(map, f);
    if (!currentSourceId) return;

    if (!isImageElement(f)) {
      ActionOrderLayer.updateDataAftermove(map, f, currentSourceId);
      removeFeatureFromLocalStorage(f.id as string);
    } else {
      ActionOrderLayer.removeLayer(map, f.id as string);
      removeFeatureFromLocalStorage(f.id as string);
    }
  });
};
