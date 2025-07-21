import { useMapContext } from "@/contexts/useMapContext";
import { LayerActions } from "@/hooks/2d/actions/actionLayer";
import { ActionSetData } from "@/hooks/2d/actions/actionSetData";
import { AppGlobals } from "@/lib/appGlobals";
import { updateFeatureInLocalStorage } from "@/lib/localStorageUtils";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import { Map } from "maplibre-gl";
import { RefObject, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { FeatureType } from "@/types/featureTypes";

interface Props {
  drawRef?: RefObject<MaplibreTerradrawControl | null>;
  mapRef: RefObject<Map | null>;
}

export const BasicComponent = ({ drawRef, mapRef }: Props) => {
  const [color, setColor] = useState<string>("#787878");
  const [height, setHeight] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [layer, setLayer] = useState<string>("");
  const [highlight, setHighlight] = useState<string>("");

  const { selectedElement, setSelectedElement } = useMapContext();
  const storedData: FeatureType[] = AppGlobals.getElements();

  const updateFeatureProperty = (
    property: string,
    value: string | number,
    mapRef: RefObject<Map | null>
  ): void => {
    const element = storedData?.find((el) => el.id === selectedElement?.id);
    const map = mapRef.current;
    if (!element || !map) return;

    const updated: FeatureType = {
      ...element,
      properties: {
        ...element.properties,
        [property]: value,
      },
    };

    const sourceId = LayerActions.findFeatureSourceId(map, element);

    // Update map source using ActionSetData class
    ActionSetData.setSelectedData(map, updated, sourceId);

    AppGlobals.setDataToStore(updated);

    // Update local storage
    updateFeatureInLocalStorage(updated);
  };

  const updateSelectedFeatureHeight = (
    height: number,
    mapRef: RefObject<Map | null>
  ): void => {
    updateFeatureProperty("height", height, mapRef);
  };

  const handleChangeColor = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newColor = e.target.value;
    setColor(newColor);
    updateFeatureProperty("color", newColor || "#787878", mapRef);
  };

  const updateSelectedFeatureLabel = (
    label: string,
    mapRef: RefObject<Map | null>
  ): void => {
    updateFeatureProperty("label", label, mapRef);
  };

  const handleChangeLayer = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newLayer = e.target.value;
    setLayer(newLayer);
    updateFeatureProperty("layer", newLayer, mapRef);
  };

  const updateSelectedFeatureHighlight = (
    highlight: string,
    mapRef: RefObject<Map | null>
  ): void => {
    updateFeatureProperty("labelImage", highlight, mapRef);
  };

  useEffect(() => {
    const element = storedData?.find((el) => el.id === selectedElement?.id);
    if (!element) {
      setColor("#787878");
      setHeight("");
      setLabel("");
      setLayer("");
      setHighlight("");
      return;
    }
    setColor(element.properties?.color);
    setHeight(element.properties?.height);
    setLabel(element.properties?.label);
    setLayer(element.properties?.layer);
    setHighlight(element.properties?.labelImage);
  }, [selectedElement]);

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
  };

  return (
    <Form>
      <SubmitButton
        type="button"
        onClick={logdata}
        style={{ marginBottom: "10px" }}
      >
        LogData
      </SubmitButton>

      <FormGroup>
        <Label htmlFor="label">Label:</Label>
        <Input
          type="string"
          id="label"
          placeholder="label..."
          value={label ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setLabel(value); // 👈 cập nhật state để tránh cảnh báo
            updateSelectedFeatureLabel(value, mapRef); // 👈 cập nhật dữ liệu feature
          }}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="height">Height:</Label>
        <Input
          type="number"
          id="height"
          placeholder="height..."
          value={height ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setHeight(value); // 👈 cập nhật state để tránh cảnh báo

            const parsed = parseFloat(value);
            if (!isNaN(parsed)) {
              updateSelectedFeatureHeight(parsed, mapRef); // 👈 cập nhật dữ liệu feature
            }
          }}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="color">Layer:</Label>
        <StyledSelect value={layer} onChange={handleChangeLayer}>
          <option value="">-- Chọn một tùy chọn --</option>
          <option value="overview">Overview</option>
          <option value="booth">Booth</option>
        </StyledSelect>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="color">Color:</Label>
        <ColorInput id="color" value={color} onChange={handleChangeColor} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="highlight">Highlight:</Label>
        <Input
          type="string"
          id="highlight"
          placeholder="Highlight Image..."
          value={highlight ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setHighlight(value); // 👈 cập nhật state để tránh cảnh báo
            updateSelectedFeatureHighlight(value, mapRef); // 👈 cập nhật dữ liệu feature
          }}
        />
      </FormGroup>
    </Form>
  );
};

const Form = styled.form`
  max-width: 500px;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-items: start;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  width: 70px;
`;

const Input = styled.input`
  width: calc(100% - 80px);
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ColorInput = styled.input.attrs({ type: "color" })`
  appearance: none;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: none;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: 8px;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 8px;
  }

  &::-moz-color-swatch {
    border: none;
    border-radius: 8px;
  }
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

const StyledSelect = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 2px solid #3498db;
  border-radius: 5px;
  background-color: white;
  color: #333;

  width: calc(100% - 60px);
  /* Hiệu ứng hover */
  &:hover {
    border-color: #2980b9;
  }

  /* Hiệu ứng focus */
  &:focus {
    outline: none;
    border-color: #2980b9;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
  }
`;
