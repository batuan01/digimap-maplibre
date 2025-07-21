// Project: Digimap Core Editor
// Copyright: © 2024 Digimap. All rights reserved.
// ZGlnaW1hcC5haSBjb3JlIGVkaXRvcg==
import { Col, InputNumber, Row, Slider } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import PanelComponentTitle from "./PanelComponentTitle";

interface CustomSliderProps {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  element?: any;
  actionManager?: any;
}
const InputContainer = styled.div`
  padding: 0 10px;
`;

const InputWrapper = styled.div`
  margin-top: 20px;
`;

export const CustomSlider = ({ value, onChange, min, max }: CustomSliderProps) => {
  const [inputValue, setInputValue] = useState<number>(value ? +value : 0);

  const handleInputChange = (value: number | null) => {
    setInputValue(value ?? 0);
    onChange && onChange(value ?? 0);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <InputContainer>
      <Row>
        <Col flex={"auto"}>
          <Slider
            min={min ?? 0}
            max={max ?? 100}
            onChange={handleInputChange}
            value={typeof value === "number" ? inputValue : 0}
          />
        </Col>
        <Col flex={"40px"}>
          <InputNumber
            min={min ?? 0}
            max={max ?? 100}
            style={{ marginLeft: "16px" }}
            value={inputValue}
            onChange={handleInputChange}
          />
        </Col>
      </Row>
    </InputContainer>
  );
};

export const CustomSliderOpacity = ({ value, onChange, min, max, element, actionManager }: CustomSliderProps) => {
  const [inputValue, setInputValue] = useState<number>(value ? +value : 0);

  const handleInputChange = (value: number | null) => {
    setInputValue(value ?? 0);
    onChange && onChange(value ?? 0);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <InputWrapper>
      <InputContainer>
        <Row align="middle">
          <Col style={{ marginRight: "10px" }}>
            <PanelComponentTitle label={"Opacity"} />
          </Col>
          <Col flex={"auto"}>
            <Slider
              min={min ?? 0}
              max={max ?? 100}
              onChange={handleInputChange}
              value={typeof value === "number" ? inputValue : 0}
            />
          </Col>
        </Row>
      </InputContainer>
    </InputWrapper>
  );
};
