import { Map } from "maplibre-gl";
import { SplitPath } from "../element/splitPath";
import { AppGlobals } from "@/lib/appGlobals";
import { ActionSelectedElement2D } from "./actionSelectedElement2D";
import { LayerActions } from "./actionLayer";
import { ActionOrderLayer } from "./actionOrderLayer";
import { removeFeatureFromLocalStorage } from "@/lib/localStorageUtils";

export class ActionMenuOption {
  static initRightMouse(map: Map) {
    map.on("contextmenu", (e) => {
      const clickedLngLat = [e.lngLat.lng, e.lngLat.lat];
      const storedData = AppGlobals.getElements();
      if (!storedData?.length) return;

      const feature = ActionSelectedElement2D.findFeatureAtPoint(
        clickedLngLat,
        storedData
      );

      if (!feature) return;

      const currentSourceId = LayerActions.findFeatureSourceId(map, feature);

      this.showContextMenu(
        e.point,
        feature,
        () => {
          if (feature) {
            ActionOrderLayer.bringForward(map, feature);
          }
        },
        () => {
          if (feature) {
            ActionOrderLayer.sendBackward(map, feature);
          }
        },
        () => {
          if (feature) {
            this.onSplitPath(map, feature, currentSourceId);
          }
        },
        () => {
          if (feature) {
            ActionOrderLayer.updateDataAftermove(map, feature, currentSourceId);
            removeFeatureFromLocalStorage(feature.id);
            AppGlobals.removeDataById(feature.id);
          }
        }
      );
    });
  }

  static showContextMenu(
    screenPoint,
    feature,
    onUp,
    onDown,
    onSplit,
    onDelete
  ) {
    const existing = document.getElementById("map-context-menu");
    if (existing) existing.remove();

    const menu = document.createElement("div");
    menu.id = "map-context-menu";

    Object.assign(menu.style, {
      position: "absolute",
      top: `${screenPoint.y}px`,
      left: `${screenPoint.x}px`,
      zIndex: 9999,
      background: "#1e1e1e", // nền đen
      borderRadius: "6px",
      padding: "6px 0",
      minWidth: "180px",
      fontSize: "13px",
      color: "#fff",
      boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
    });

    const options = [
      { key: "up", label: "Bring forward", shortcut: "Ctrl+[", action: onUp },
      {
        key: "down",
        label: "Send backward",
        shortcut: "Ctrl+]",
        action: onDown,
      },
    ];

    if (isPathElement(feature)) {
      options.push({
        key: "split",
        label: "Flatten path",
        shortcut: "",
        action: onSplit,
      });
    }

    options.push({
      key: "delete",
      label: "Delete",
      shortcut: "Delete",
      action: onDelete,
      isDelete: true,
    });

    for (const opt of options) {
      const item = document.createElement("div");

      Object.assign(item.style, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6px 12px",
        cursor: "pointer",
        color: opt.isDelete ? "#ff4d4f" : "#fff",
        fontWeight: opt.isDelete ? "bold" : "normal",
      });

      item.onmouseenter = () => (item.style.background = "#333");
      item.onmouseleave = () => (item.style.background = "transparent");

      const labelSpan = document.createElement("span");
      labelSpan.textContent = opt.label;

      const shortcutSpan = document.createElement("span");
      shortcutSpan.textContent = opt.shortcut || "";
      shortcutSpan.style.opacity = "0.6";
      shortcutSpan.style.fontSize = "12px";

      item.appendChild(labelSpan);
      item.appendChild(shortcutSpan);

      item.onclick = () => {
        opt.action?.();
        menu.remove();
      };

      menu.appendChild(item);
    }

    document.body.appendChild(menu);
  }

  static onSplitPath = (map, feature, currentSourceId) => {
    ActionHandleDragging.removeHandlesPoint(map);

    const sourceFeatures = map.getSource(currentSourceId);
    const sourceData = sourceFeatures._data || sourceFeatures._options?.data;
    let currentFeature = sourceData?.features?.[0];

    currentFeature.geometry.coordinates = SplitPath.addCutPoints(
      currentFeature.geometry.coordinates
    );

    ActionHandleDragging.newHandlesPoint(map, currentFeature);

    ActionSetData.setSelectedData(map, currentFeature, currentSourceId);
    AppGlobals.setDataToStore(currentFeature);
    updateFeatureInLocalStorage(currentFeature);
  };
}
