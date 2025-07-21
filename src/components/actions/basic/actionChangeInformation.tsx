import { DGMInputText } from "@/components/common/DGMInputText";
import { DGMPanelRow } from "@/components/common/DGMPanelRow";
import { DGMPanelTab } from "@/components/common/DGMPanelTab";
import { DGMSelect } from "@/components/common/DGMSelect";
import { DEFAULT_LAYER } from "@/constants/constants";
import { useMapContext } from "@/contexts/useMapContext";
import { AppGlobals } from "@/lib/appGlobals";
import { Map } from "maplibre-gl";
import { RefObject } from "react";

export const ActionChangeInformation = ({
  mapRef,
}: {
  mapRef: RefObject<Map | null>;
}) => {
  const { selectedElement } = useMapContext();
  const options = Object.entries(DEFAULT_LAYER).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  return (
    <DGMPanelTab label={"Information"} guide>
      <DGMPanelRow label={"ID (DEV)"}>
        <DGMInputText
          value={AppGlobals.getFormValue<string>(selectedElement, "id", "")}
          disabled
        />
      </DGMPanelRow>
      <DGMPanelRow label={"Index"}>
        <DGMInputText
          value={AppGlobals.getFormValue<string>(selectedElement, "index", "")}
          disabled
        />
      </DGMPanelRow>
      <DGMPanelRow label={"Name"}>
        <DGMInputText
          onChange={(e) =>
            AppGlobals.updateFormValue(
              selectedElement,
              { label: e },
              mapRef.current!
            )
          }
          value={AppGlobals.getFormValue<string>(selectedElement, "label", "")}
        />
      </DGMPanelRow>
      <DGMPanelRow label={"Layer"}>
        <DGMSelect
          value={AppGlobals.getFormValue<string>(selectedElement, "layer", "")}
          options={options}
          onChange={(e) =>
            AppGlobals.updateFormValue(
              selectedElement,
              { layer: e },
              mapRef.current!
            )
          }
        />
      </DGMPanelRow>
    </DGMPanelTab>
  );
};
