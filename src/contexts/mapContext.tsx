"use client"
import React, { ReactNode, createContext, useState } from "react";
import { FeatureType } from "@/types/featureTypes";

interface MapContextProps {
  selectedElement: FeatureType | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<FeatureType | null>>;
}
interface PropsAuthContext {
  children: ReactNode;
}

const MapContext = createContext<MapContextProps | null>(null);

const MapProvider: React.FC<PropsAuthContext> = ({ children }) => {
  const [selectedElement, setSelectedElement] = useState<FeatureType | null>(
    null
  );

  const contextValue: MapContextProps = {
    selectedElement,
    setSelectedElement,
  };

  return (
    <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
  );
};

export { MapProvider, MapContext };
