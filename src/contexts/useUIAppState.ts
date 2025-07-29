// hooks/useMapContext.ts

import { useContext } from "react";
import { AppContext } from "./mapContext";
import { AppState } from "@/types/stateTypes";

export const useUIAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useUIAppState must be used within an AppProvider");
  }
  return context.appState;
};

export const useDigimapSetAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useDigimapSetAppState must be used within an AppProvider");
  }

  return (newState: Partial<AppState>) => {
    context.setAppState((prev) => ({ ...prev, ...newState }));
  };
};
