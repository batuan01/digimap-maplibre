"use client";
// MapDraw.tsx
import { useEffect, useRef } from "react";

import { useDigimapSetAppState, useUIAppState } from "@/contexts/useUIAppState";
import { ActionBoundingBox } from "@/hooks/2d/actions/actionBoundingBox";
import { ActionDrawElement } from "@/hooks/2d/actions/actionDrawElement";
import { ActionKeyboard } from "@/hooks/2d/actions/actionKeyboard";
import { ActionLoadData2D } from "@/hooks/2d/actions/actionLoadData2D";
import { ActionMenuOption } from "@/hooks/2d/actions/actionMenuOption";
import { ActionSelectedElement2D } from "@/hooks/2d/actions/actionSelectedElement2D";
import { getSelectedElement } from "@/hooks/2d/appState";
import { completelyDisableDragging } from "@/hooks/2d/canvas";
import { createMap } from "@/hooks/map";
import { AppGlobals } from "@/lib/appGlobals";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/localStorageUtils";
import { deepEqual } from "@/lib/utils";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import { Map } from "maplibre-gl";
import CustomToolbar from "../bottom-panel/CustomToolbar";
import { RightPanel } from "./right-panel/RightPanel";

const Map2DComponent = () => {
  const mapRef = useRef<Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const drawRef = useRef<MaplibreTerradrawControl | null>(null);
  const isPathRef = useRef<boolean>(false);

  const appState = useUIAppState();
  const setAppState = useDigimapSetAppState();
  const selectedElement = getSelectedElement(appState);

  useEffect(() => {
    const map = createMap({
      mapContainer: mapContainer.current,
      bearing: -33.5,
    });

    mapRef.current = map;
    map.doubleClickZoom.disable();
    // map.dragPan.disable();

    ActionDrawElement.Terradraw(map, drawRef, isPathRef);

    ActionSelectedElement2D.getSelectedElement({
      map: mapRef.current,
      getAppState: () => appStateRef.current,
      setAppState,
    });
    ActionSelectedElement2D.getDoubleClickSelection({
      map: mapRef.current,
      getAppState: () => appStateRef.current,
      setAppState,
    });

    map.on("load", () => {
      ActionLoadData2D.loadDefaultData(map);
      ActionBoundingBox.hoverBBoxSelected(
        map,
        () => appStateRef.current,
        selectedElement
      );
    });

    ActionMenuOption.initRightMouse(map);

    completelyDisableDragging(map);
    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    ActionKeyboard.keyDown(mapContainer, mapRef, selectedElement);
  }, [selectedElement]);

  const appStateRef = useRef(appState);

  useEffect(() => {
    appStateRef.current = appState;
  }, [appState]);

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
      if (
        !deepEqual(loadFromLocalStorage()?.features, AppGlobals.getElements())
      ) {
        console.log("Chạy logic mỗi 5s");
        saveToLocalStorage({
          type: "FeatureCollection",
          features: AppGlobals.getElements(),
        });
      }
    }, 5000);

    return () => {
      clearInterval(interval); // Clear khi unmount
    };
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div ref={mapContainer} style={{ height: "100%" }} />

      <RightPanel mapContainer={mapContainer} mapRef={mapRef} />
      <CustomToolbar mapRef={mapRef} />
    </div>
  );
};

export default Map2DComponent;
