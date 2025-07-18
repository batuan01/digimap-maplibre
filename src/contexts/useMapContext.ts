// hooks/useMapContext.ts
import { useContext } from "react";
import { MapContext } from "./mapContext";
import { FeatureType } from "@/types/featureTypes";

export function useMapContext(): {
  selectedElement: FeatureType | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<FeatureType | null>>;
} {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
}
