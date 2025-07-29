import Map2DComponent from "@/components/2d/Map2DComponent";
import { AppProvider } from "@/contexts/mapContext";

export default function Map2D() {
  return (
    <AppProvider>
      <Map2DComponent />
    </AppProvider>
  );
}
