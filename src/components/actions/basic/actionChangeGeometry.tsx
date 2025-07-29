import { DGMInputNumber } from "@/components/common/DGMInputNumber";
import { DGMPanelRow } from "@/components/common/DGMPanelRow";
import { DGMPanelTab } from "@/components/common/DGMPanelTab";
import {  useUIAppState } from "@/contexts/useUIAppState";
import { getSelectedElement } from "@/hooks/2d/appState";
import { AppGlobals } from "@/lib/appGlobals";
import { Map } from "maplibre-gl";
import { RefObject } from "react";

export const ActionChangeGeometry = ({
  mapRef,
}: {
  mapRef: RefObject<Map | null>;
}) => {
  const appState = useUIAppState();
  const selectedElement = getSelectedElement(appState);

  return (
    <DGMPanelTab label={"Geometry"}>
      <DGMPanelRow label={"Height"}>
        <DGMInputNumber
          max={500}
          value={AppGlobals.getFormValue<number>(selectedElement, "height", 0)}
          onChange={(e) =>
            AppGlobals.updateFormValue(
              selectedElement,
              { height: e },
              mapRef.current!
            )
          }
        />
      </DGMPanelRow>
    </DGMPanelTab>
  );
};
