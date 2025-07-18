import { MapProvider } from "@/contexts/mapContext";
import MapLibre3D from "@/components/3d/Map3DComponent";

export default function Map3D() {
  return (
    <MapProvider>
      <MapLibre3D />
    </MapProvider>
  );
}
