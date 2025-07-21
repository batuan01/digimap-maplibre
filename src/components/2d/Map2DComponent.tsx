"use client";
// MapDraw.tsx
import { useEffect, useRef, useState } from "react";

// @ts-ignore: TerraDraw is a UMD global so we import it this way
import { useMapContext } from "@/contexts/useMapContext";
import { ActionBoundingBox } from "@/hooks/2d/actions/actionBoundingBox";
import { ActionDrawElement } from "@/hooks/2d/actions/actionDrawElement";
import { ActionKeyboard } from "@/hooks/2d/actions/actionKeyboard";
import { ActionLoadData2D } from "@/hooks/2d/actions/actionLoadData2D";
import { ActionMenuOption } from "@/hooks/2d/actions/actionMenuOption";
import { ActionSelectedElement2D } from "@/hooks/2d/actions/actionSelectedElement2D";
import { createMap } from "@/hooks/map";
import { Map } from "maplibre-gl";
import styled from "styled-components";
import CustomToolbar from "../bottom-panel/CustomToolbar";
import { BasicComponent } from "./right-panel/BasicComponent";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";

const Map2DComponent = () => {
  const mapRef = useRef<Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const drawRef = useRef<MaplibreTerradrawControl | null>(null);
  const isPathRef = useRef<boolean>(false);
  const [hide, setHide] = useState<boolean>(true);

  const { selectedElement, setSelectedElement } = useMapContext();

  useEffect(() => {
    const map = createMap({
      mapContainer: mapContainer.current,
      bearing: -33.5,
    });

    mapRef.current = map;
    map.doubleClickZoom.disable();
    // map.dragPan.disable();

    ActionDrawElement.Terradraw(map, drawRef, isPathRef);

    map.on("click", (e) => {
      // const selected = drawRef.current.getFeatures(true).features;
      // if (selected.length) {
      //   const feature = selected[0];
      //   const height = feature.properties?.height ?? "";
      //   setHeight(Number(height));
      // } else {
      //   setHeight("");
      // }
    });

    ActionSelectedElement2D.getSelectedElement({ map, setSelectedElement });
    ActionSelectedElement2D.getDoubleClickSelection({
      map,
      setSelectedElement,
    });

    map.on("load", () => {
      ActionLoadData2D.loadDefaultData(map);
      ActionBoundingBox.hoverBBoxSelected(mapRef.current!, selectedElement);
    });

    ActionMenuOption.initRightMouse(map);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    ActionKeyboard.keyDown(mapContainer, mapRef, selectedElement);
  }, [selectedElement]);

  // Hide context menu when click outside
  useEffect(() => {
    const handleClick = () => {
      const existing = document.getElementById("map-context-menu");
      if (existing) existing.remove();
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    setHide(!selectedElement);
  }, [selectedElement]);

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <div ref={mapContainer} style={{ height: "100%" }} />

      <ButtonShow onClick={() => setHide(!hide)}>Show</ButtonShow>
      {!hide && (
        <FormProperty>
          <BasicComponent mapContainer={mapContainer} mapRef={mapRef} />
        </FormProperty>
      )}

      <CustomToolbar drawRef={drawRef} mapRef={mapRef} isPathRef={isPathRef} />
    </div>
  );
};

export default Map2DComponent;

const FormProperty = styled.div`
  position: absolute;
  top: 40px;
  right: 10px;
  width: 300px;
  text-align: center;
`;

const ButtonShow = styled.button`
  padding: 0.6rem 1.2rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  position: absolute;
  top: 2px;
  right: 10px;
  z-index: 2;

  &:hover {
    background: #0056b3;
  }
`;
