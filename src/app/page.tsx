import Map2DComponent from "@/components/2d/Map2DComponent";
import { MapProvider } from "@/contexts/mapContext";

export default function Map2D() {
  return (
    <MapProvider>
      <Map2DComponent />
    </MapProvider>
  );
}
