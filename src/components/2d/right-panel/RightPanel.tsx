import { ActionChangeBasicProperties } from "@/components/actions/basic/actionChangeBasicProperties";
import { ActionChangeInformation } from "@/components/actions/basic/actionChangeInformation";
import { Icons } from "@/components/common/DGMIcons";
import { DGMToolPanelSwitcher } from "@/components/common/DGMToolPanelSwitcher";
import { AppGlobals } from "@/lib/appGlobals";
import { RefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { ExportMapToPDF } from "./ExportMapToPDF";
import { Map } from "maplibre-gl";
import { useMapContext } from "@/contexts/useMapContext";
import { FeatureType } from "@/types/featureTypes";
import { ActionChangeMaterial } from "@/components/actions/basic/actionChangeMaterial";
import { ActionChangeGeometry } from "@/components/actions/basic/actionChangeGeometry";

export const ElementPageType = {
  GLOBAL_GENERAL: "GLOBAL_GENERAL",
  GLOBAL_THEME: "GLOBAL_THEME",
  EDITOR_3D: "EDITOR_3D",
  INFO: "INFO",
  MATERIAL: "MATERIAL",
  GEOMETRY: "GEOMETRY",
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  QR: "QR",
  CONNECTION: "CONNECTION",
  DOOR: "DOOR",
  BEACON: "BEACON",
};

interface Props {
  mapContainer: RefObject<HTMLDivElement | null>;
  mapRef: RefObject<Map | null>;
}

export const RightPanel = ({ mapContainer, mapRef }: Props) => {
  const { selectedElement } = useMapContext();

  const [page, setPage] = useState<string>(ElementPageType.INFO);
  const [types, setTypes] = useState<string[]>([]);
  const [prevSelectedElement, setPrevSelectedElement] =
    useState<FeatureType | null>(null);

  const handlePageChange = (value: string) => {
    setPage(value);
  };

  const logdata = (): void => {
    // const draw = drawRef.current;
    // const geojson = draw.getFeatures();
    // // console.log("geojson", geojson);
    console.log(mapRef.current?.getStyle());
    // const map = mapRef.current;
    // moveLayerUp(mapRef.current, "layer-9c6f0cf2-3e56-4ceb-9257-53a902d82e67");
    // map.removeLayer("layer-9c6f0cf2-3e56-4ceb-9257-53a902d82e67");
    // map.moveLayer(layerId, aboveLayerId);
    // console.log("selectedElement", selectedElement);

    // console.log(loadFromLocalStorage());

    console.log("AppGlobals.getElements()", AppGlobals.getElements());
    // console.log("types", types);
    // console.log("page", page);
  };

  useEffect(() => {
    let newTypes: string[] = [];
    if (selectedElement) {
      newTypes = [
        ElementPageType.INFO,
        ElementPageType.MATERIAL,
        ElementPageType.GEOMETRY,
      ];
    } else {
      newTypes = [ElementPageType.GLOBAL_GENERAL];
    }

    if (
      prevSelectedElement?.id !== selectedElement?.id ||
      types.length !== newTypes.length ||
      !types.every((v, i) => v === newTypes[i])
    ) {
      if (!newTypes.includes(page)) {
        setPage(newTypes[0]);
      }
      setTypes(newTypes);
    }
    setPrevSelectedElement(selectedElement);
  }, [selectedElement]);

  const renderPageComponent = () => {
    if (!mapRef.current) return <></>;
    switch (page) {
      case ElementPageType.GLOBAL_GENERAL:
        return <></>;

      case ElementPageType.INFO: {
        return (
          <>
            <ActionChangeBasicProperties mapRef={mapRef} />
            <ActionChangeInformation mapRef={mapRef} />
          </>
        );
      }
      case ElementPageType.MATERIAL:
        return (
          <>
            <ActionChangeMaterial mapRef={mapRef} />
          </>
        );
      case ElementPageType.GEOMETRY:
        return (
          <>
            <ActionChangeGeometry mapRef={mapRef} />
          </>
        );

      default:
        return <></>;
    }
  };

  return (
    <RightPanelWrapper>
      <RightPanelTopActionsWrapper>
        <ActionButton>
          <Icons.Settings />
        </ActionButton>

        <ActionButton>
          <Icons.Play />
        </ActionButton>

        <ExportMapToPDF mapContainer={mapContainer} mapRef={mapRef} />
      </RightPanelTopActionsWrapper>

      <SelectedElementActionsWrapper>
        <DGMToolPanelSwitcher
          value={page}
          types={types}
          onPageChange={handlePageChange}
        />
        <PublishButton type="button" onClick={logdata}>
          Log
        </PublishButton>
      </SelectedElementActionsWrapper>

      {renderPageComponent()}
    </RightPanelWrapper>
  );
};

const RightPanelWrapper = styled.div`
  position: absolute;
  background-color: var(--color-bg);
  top: 10px;
  right: 10px;
  width: var(--component-container-width);
  height: calc(100% - 20px);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  border-bottom: 1px solid var(--color-conditional-border);
  border: 0.5px solid var(--color-border, #e5e5e5);
  box-sizing: border-box;
  pointer-events: all;
  box-shadow: 0 10px 10px #0000001a;
  z-index: 4;
  border-radius: 8px;
  padding: 12px 0px;
  align-items: center;

  // > :first-child {
  //   padding: 0px 12px 12px;
  //   width: calc(100% - 24px);
  //   gap: 2px;
  // }
`;

const ActionButton = styled.button`
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI,
    Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    Segoe UI Symbol;
  position: relative;
  border: none;
  margin: 0;
  -webkit-appearance: none;
  outline: none;
  text-decoration: none;
  user-select: none;
  display: flex;
  min-width: 30px;
  flex: 0 0 auto;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  font-weight: var(--digimap-heading-font-weight, 600);
  transition: border-color ease 0.15s, background-color ease 0.15s;
  border-radius: 8px;
  padding: 0;
  background-color: var(--digimap-toolbarButtonBackground-color, #f3f3f3);
  color: var(--digimap-toolbarSettingsButtonTextSites-color, #333333);
  width: 30px;
  height: 30px;
  font-size: var(--digimap-base-font-size, 12px);
  cursor: pointer;

  &:disabled {
    color: #a0a0a0;
    cursor: not-allowed;
  }
`;

const RightPanelTopActionsWrapper = styled.div`
  padding: 0px 15px 12px 15px;
  width: 100%;
  border-bottom: 1px solid var(--digimap-panelDivider-color, #eeeeee);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  outline: none;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  -webkit-box-align: stretch;
  align-items: stretch;
  -webkit-box-pack: end;
  justify-content: flex-end;
  gap: 10px;
`;

export const PublishButton = styled.button`
  --shrink: 0;
  -webkit-font-smoothing: antialiased;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI,
    Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    Segoe UI Symbol;
  position: relative;
  border: none;
  margin: 0;
  -webkit-appearance: none;
  outline: none;
  text-decoration: none;
  user-select: none;
  z-index: 0;
  box-sizing: border-box;
  padding: 0 10px;
  border-radius: 8px;
  font-weight: var(--digimap-heading-font-weight, 600);
  transition: none;
  overflow: hidden;
  background-color: var(
    --digimap-buttonWithDepthPrimaryBackground-color,
    #0099ff
  );
  box-shadow: var(
    --digimap-buttonWithDepthPrimaryShadow-color,
    0px 4px 8px 0px rgba(0, 153, 255, 0.3)
  );
  color: var(--digimap-buttonTextPrimary-color, #ffffff);
  width: auto;
  height: 30px;
  font-size: var(--digimap-base-font-size, 12px);
  min-width: 62px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:disabled {
    background-color: #f3f3f3;
    color: #a0a0a0;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const SelectedElementActionsWrapper = styled.div`
  color-scheme: light;
  color: var(--color-text, #333333);
  margin: 0;
  border: 0;
  font: inherit;
  vertical-align: inherit;
  outline: none;
  letter-spacing: inherit;
  text-decoration: none;
  cursor: inherit;
  user-select: none;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  scrollbar-width: none;

  .ant-segmented-item-selected {
    background-color: #0099ff;
  }

  .ant-segmented-item-selected > .ant-segmented-item-label {
    color: #fff !important;
  }

  .ant-segmented-thumb {
    background-color: #ffffff;
  }
`;
