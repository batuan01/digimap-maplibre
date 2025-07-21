import { DGMInputNumber } from "@/components/common/DGMInputNumber";
import { DGMPanelRow } from "@/components/common/DGMPanelRow";
import { DGMPanelTab } from "@/components/common/DGMPanelTab";
import { useMapContext } from "@/contexts/useMapContext";
import { ActionBoundingBox } from "@/hooks/2d/actions/actionBoundingBox";
import { ActionHandleDragging } from "@/hooks/2d/actions/actionHandleDragging";
import { ActionRotateElement } from "@/hooks/2d/actions/actionRotateElement";
import { AppGlobals } from "@/lib/appGlobals";
import { Map } from "maplibre-gl";
import { RefObject } from "react";

export const ActionChangeBasicProperties = ({
  mapRef,
}: {
  mapRef: RefObject<Map | null>;
}) => {
  const { selectedElement } = useMapContext();

  const handleRotate = (e: number) => {
    if (!mapRef.current || !selectedElement) return;

    //remove bounding box and handle
    ActionBoundingBox.clearBoundingBox(mapRef.current, "selected");
    ActionHandleDragging.removeHandlesPoint(mapRef.current);

    //update data
    AppGlobals.updateFormValue(selectedElement, { angle: e }, mapRef.current);
    const polygonFeature = ActionRotateElement.rotateByAngle(
      mapRef.current,
      selectedElement,
      -e
    );

    if (!polygonFeature) return;
    AppGlobals.setDataToStore(polygonFeature);
  };

  return (
    <DGMPanelTab label={"Position & Size"} guide>
      <DGMPanelRow label={"Rotate"}>
        <DGMInputNumber
          min={0}
          max={360}
          type="angle"
          value={AppGlobals.getFormValue<number>(selectedElement, "angle", 0)}
          onChange={(e) => handleRotate(e)}
        />
      </DGMPanelRow>
    </DGMPanelTab>
  );
};
