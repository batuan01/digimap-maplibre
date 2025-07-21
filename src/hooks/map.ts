import { DEFAULT_COORDINATES } from "@/constants/mapConfig";
import maplibregl, { LngLatLike, Map } from "maplibre-gl";

interface CreateMapOptions {
  mapContainer: HTMLDivElement | null;
  pitchWithRotate?: boolean;
  dragRotate?: boolean;
  pitch?: number;
  bearing?: number;
  zoom?: number;
}

export const createMap = ({
  mapContainer,
  pitchWithRotate = false,
  dragRotate = false,
  pitch = 0,
  bearing = 0,
  zoom = 16,
}: CreateMapOptions): Map => {
  const map = new maplibregl.Map({
    container: mapContainer || "map",
    style:
      "https://api.maptiler.com/maps/fefc1891-4e0d-4102-a51f-09768f839b85/style.json?key=S1qTEATai9KydkenOF6W",
    center: DEFAULT_COORDINATES as LngLatLike,
    zoom,
    pitchWithRotate,
    dragRotate,
    touchPitch: false,
    pitch,
    bearing,
  });

  return map;
};
