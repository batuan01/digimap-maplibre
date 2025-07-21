"use client";
// MapDraw.tsx
import { useEffect, useRef } from "react";

// @ts-ignore: TerraDraw is a UMD global so we import it this way
import { useMapContext } from "@/contexts/useMapContext";
import { ActionBoundingBox } from "@/hooks/2d/actions/actionBoundingBox";
import { ActionDrawElement } from "@/hooks/2d/actions/actionDrawElement";
import { ActionKeyboard } from "@/hooks/2d/actions/actionKeyboard";
import { ActionLoadData2D } from "@/hooks/2d/actions/actionLoadData2D";
import { ActionMenuOption } from "@/hooks/2d/actions/actionMenuOption";
import { ActionSelectedElement2D } from "@/hooks/2d/actions/actionSelectedElement2D";
import { createMap } from "@/hooks/map";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import { Map } from "maplibre-gl";
import styled from "styled-components";
import CustomToolbar from "../bottom-panel/CustomToolbar";
import { RightPanel } from "./right-panel/RightPanel";
import { saveToLocalStorage } from "@/lib/localStorageUtils";
import { AppGlobals } from "@/lib/appGlobals";

const Map2DComponent = () => {
  const mapRef = useRef<Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const drawRef = useRef<MaplibreTerradrawControl | null>(null);
  const isPathRef = useRef<boolean>(false);

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
    const interval = setInterval(() => {
      console.log("Chạy logic mỗi 5s");
      saveToLocalStorage({
        type: "FeatureCollection",
        features: AppGlobals.getElements(),
      });
    }, 5000);

    return () => {
      clearInterval(interval); // Clear khi unmount
    };
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <div ref={mapContainer} style={{ height: "100%" }} />

      <RightPanel mapContainer={mapContainer} mapRef={mapRef} />
      <CustomToolbar drawRef={drawRef} mapRef={mapRef} isPathRef={isPathRef} />
    </div>
  );
};

export default Map2DComponent;
