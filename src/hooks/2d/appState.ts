import { AppGlobals } from "@/lib/appGlobals";
import { FeatureType } from "@/types/featureTypes";
import { AppState } from "@/types/stateTypes";

export const getDefaultAppState = (): Omit<AppState, "width" | "height"> => {
  return {
    selectedElementIds: [],
    activeTool: "pointer",
  };
};

export const getSelectedElements = (appState: AppState): FeatureType[] => {
  const storedData = AppGlobals.getElements();
  if (!storedData || !storedData.length) return [];
  return storedData.filter((feature) =>
    appState.selectedElementIds.includes(feature.properties?.id)
  );
};

export const getSelectedElement = (appState: AppState): FeatureType | null => {
  const selectedElements = getSelectedElements(appState);
  return selectedElements.length > 0 ? selectedElements[0] : null;
};
