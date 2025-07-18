import { AppGlobals } from "@/lib/appGlobals";
import { ActionRemovePoint } from "./actionRemovePoint";
import { ActionHandleDragging } from "./actionHandleDragging";
import { ActionBoundingBox } from "./actionBoundingBox";
import { ActionRotateElement } from "./actionRotateElement";
import { isImageElement } from "../element/typeChecks";
import { ActionOrderLayer } from "./actionOrderLayer";
import { removeFeatureFromLocalStorage } from "@/lib/localStorageUtils";

export class ActionKeyboard {
  static selectedMultipleElements = [];
  static keyDown(mapContainer, mapRef, selectedElement) {
    const handleKeyDown = (e) => {
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
        if (ActionRemovePoint.targetPoint) {
          ActionRemovePoint.removeOnlyPoint(map);
          return;
        }

        if (selectedElement) {
          clearAllFeatures(map, [selectedElement]);
          AppGlobals.removeDataById(selectedElement.id);
        }

        if (this.selectedMultipleElements.length) {
          clearAllFeatures(map, this.selectedMultipleElements);
          this.selectedMultipleElements = [];
          AppGlobals.setElements([]);
        }

        ActionHandleDragging.removeHandlesPoint(map);
        ActionBoundingBox.clearBoundingBox({ map, layerType: "selected" });
    ActionBoundingBox.clearBoundingBox({ map, layerType: "hover" });
        ActionRotateElement.destroy(map);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }
}

export const clearAllFeatures = (map, features) => {
  if (!features.length) return;

  features.forEach((f) => {
    const currentSourceId = LayerActions.findFeatureSourceId(map, f);

    if (!isImageElement(f)) {
      ActionOrderLayer.updateDataAftermove(map, f, currentSourceId);
      removeFeatureFromLocalStorage(f.id);
    } else {
      ActionOrderLayer.removeLayer(map, f.id);
      removeFeatureFromLocalStorage(f.id);
    }
  });
};
