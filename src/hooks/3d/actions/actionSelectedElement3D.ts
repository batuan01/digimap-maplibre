import { ActionSelectedElement2D } from "@/hooks/2d/actions/actionSelectedElement2D";
import { isPathElement } from "@/hooks/2d/element/typeChecks";
import { AppGlobals } from "@/lib/appGlobals";
import { LngLatLike, Map, Marker } from "maplibre-gl";
import { ActionConvertData } from "./actionConvertData";
import { AppState } from "@/types/stateTypes";

export class ActionSelectedElement3D {
  static getSelectedData({
    map,
    appState,
    setAppState,
  }: {
    map: Map;
    appState: AppState;
    setAppState: (newState: Partial<AppState>) => void;
  }) {
    let currentMarker: Marker | null = null; // 👉 Lưu marker hiện tại

    map.on("click", (e) => {
      const clickedLngLat = [e.lngLat.lng, e.lngLat.lat];
      const storedData = AppGlobals.getElements();
      if (!storedData?.length) return;

      const featureNotPath = storedData.filter((f) => !isPathElement(f));

      const feature = ActionSelectedElement2D.findFeatureAtPoint(
        clickedLngLat,
        featureNotPath
      );

      // 👉 Xóa marker cũ nếu có
      if (currentMarker) {
        currentMarker.remove();
        currentMarker = null;
      }

      if (feature) {
        setAppState({
          selectedElementIds: [
            ...appState.selectedElementIds,
            feature.properties?.id,
          ],
        });

        const convertCenter = ActionConvertData.convertLabel([feature]);
        const coordinate = convertCenter[0].geometry.coordinates;

        currentMarker = new Marker({
          draggable: true,
        })
          .setLngLat(coordinate as LngLatLike)
          .addTo(map); // Lưu lại marker
      } else {
        setAppState({ selectedElementIds: [] });
      }
    });
  }
}
