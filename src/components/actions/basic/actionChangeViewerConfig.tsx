import { DGMInputNumber } from "@/components/common/DGMInputNumber";
import { DGMPanelRow } from "@/components/common/DGMPanelRow";
import { DGMPanelTab } from "@/components/common/DGMPanelTab";
import { AppGlobals } from "@/lib/appGlobals";

export const ActionChangeViewerConfig = () => {
  return (
    <DGMPanelTab label={"Viewer Config"} guide>
      <DGMPanelRow label={"Handle Size"}>
        <DGMInputNumber
          value={AppGlobals.sizeHandle}
          onChange={(value) => AppGlobals.setSizeHandle(value)}
          min={0.1}
          max={25}
          setting
        />
      </DGMPanelRow>
    </DGMPanelTab>
  );
};
