import { AppProvider } from "@/contexts/mapContext";
import MapLibre3D from "@/components/3d/Map3DComponent";

export default function Map3D() {
  return (
    <AppProvider>
      <MapLibre3D />
    </AppProvider>
  );
}
