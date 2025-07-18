"use client";

// Map3DView.tsx
import "maplibre-gl/dist/maplibre-gl.css";
import { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { useMapContext } from "@/contexts/useMapContext";
import { useRouter } from "next/navigation";
import { loadFromLocalStorage } from "@/lib/localStorageUtils";
import { ActionConvertData } from "@/hooks/3d/actions/actionConvertData";
import { createMap } from "@/hooks/map";
import { Map } from "maplibre-gl";
import { ActionSelectedElement3D } from "@/hooks/3d/actions/actionSelectedElement3D";
import { ActionLoadLabel } from "@/hooks/3d/actions/actionLoadLabel";
import { ActionLoadData3D } from "@/hooks/3d/actions/actionLoadData3D";
import { ZOOM_OVERVIEW } from "@/constants/mapConfig";
import { PropertiesComponent } from "./left-panel/PropertiesComponent";
import CustomToolbar from "../bottom-panel/CustomToolbar";

// const booths = require("../data/booths.geojson");

const MapLibre3D = () => {
  const router = useRouter();
  const mapContainer = useRef(null);
  const mapRef = useRef<Map | null>(null);
  const { selectedElement, setSelectedElement } = useMapContext();

  const storedData = loadFromLocalStorage()!;
  // const storedData = booths;

  const polygonFeatures = ActionConvertData.filterPolygonElements(
    storedData.features
  );

  const labelFeatures = ActionConvertData.convertLabel(polygonFeatures);

  useEffect(() => {
    const map = createMap({
      mapContainer: mapContainer.current,
      pitchWithRotate: true,
      dragRotate: true,
      pitch: 45,
      bearing: -33.5,
      zoom: 17.1,
    });

    mapRef.current = map;

    ActionSelectedElement3D.getSelectedData({ map, setSelectedElement });

    map.on("load", () => {
      ActionLoadLabel.loadAllImagesLabel(map, labelFeatures);

      ActionLoadData3D.updateElementsByZoom(map, storedData);

      let wasAboveThreshold = false; // Khởi tạo biến

      map.on("zoom", () => {
        const currentZoom = map.getZoom();
        const isAboveThreshold = currentZoom >= ZOOM_OVERVIEW;

        if (isAboveThreshold !== wasAboveThreshold) {
          ActionLoadData3D.updateElementsByZoom(map, storedData);
          wasAboveThreshold = isAboveThreshold; // Cập nhật trạng thái
        }
      });
    });

    return () => map.remove();
  }, []);

  const handleGoTo2D = () => {
    router.push("/");
  };

  const logdata = () => {
    // const draw = drawRef.current;
    // const geojson = draw.getFeatures();
    // console.log("geojson", geojson);
    console.log(mapRef.current?.getStyle());
    // console.log("AppGlobals.getElements()", AppGlobals.getElements());
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div ref={mapContainer} style={{ height: "100%" }} />

      <FormProperty>
        <SubmitButton onClick={handleGoTo2D}>2D</SubmitButton>
        <button type="button" onClick={logdata}>
          Save
        </button>
      </FormProperty>

      <PropertiesComponent mapRef={mapRef} />

      <CustomToolbar mapRef={mapRef} />
    </div>
  );
};

export default MapLibre3D;

const FormProperty = styled.div`
  position: absolute;
  top: 40px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  width: 300px;
  text-align: center;
`;

const SubmitButton = styled.button`
  padding: 0.6rem 1.2rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }

  a {
    text-decoration: none;
    color: white;
  }
`;
