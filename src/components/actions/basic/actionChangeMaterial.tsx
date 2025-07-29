import { DGMColorPicker } from "@/components/common/DGMColorPicker";
import { DGMInputNumber } from "@/components/common/DGMInputNumber";
import { DGMPanelRow } from "@/components/common/DGMPanelRow";
import { DGMPanelTab } from "@/components/common/DGMPanelTab";
import { useUIAppState } from "@/contexts/useUIAppState";
import { getSelectedElement } from "@/hooks/2d/appState";
import { AppGlobals } from "@/lib/appGlobals";
import { AggregationColor } from "antd/es/color-picker/color";
import { Map } from "maplibre-gl";
import { RefObject } from "react";

export const ActionChangeMaterial = ({
  mapRef,
}: {
  mapRef: RefObject<Map | null>;
}) => {
   const appState = useUIAppState();
   const selectedElement = getSelectedElement(appState);
  return (
    <DGMPanelTab label={"Material"}>
      <DGMPanelRow label={"Stroke"}>
        <DGMInputNumber
          value={AppGlobals.getFormValue<number>(selectedElement, "stroke", 0)}
          onChange={(e) =>
            AppGlobals.updateFormValue(
              selectedElement,
              { stroke: e },
              mapRef.current!
            )
          }
          step={0.1}
          min={0.1}
          max={25}
          precision={1}
        />
      </DGMPanelRow>

      <DGMPanelRow label={"Opacity"}>
        <DGMInputNumber
          value={
            AppGlobals.getFormValue<number>(selectedElement, "opacity", 0) * 100
          }
          onChange={(e) =>
            AppGlobals.updateFormValue(
              selectedElement,
              { opacity: e / 100 },
              mapRef.current!
            )
          }
        />
      </DGMPanelRow>

      <DGMPanelRow label={"Color"}>
        <DGMColorPicker
          value={AppGlobals.getFormValue<string>(
            selectedElement,
            "color",
            "#000000"
          )}
          handleChange={(color: AggregationColor) =>
            AppGlobals.updateFormValue(
              selectedElement,
              { color: color.toHexString() },
              mapRef.current!
            )
          }
        />
      </DGMPanelRow>
    </DGMPanelTab>
  );
};
