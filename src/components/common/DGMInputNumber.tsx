// Project: Digimap Core Editor
// Copyright: © 2024 Digimap. All rights reserved.
// ZGlnaW1hcC5haSBjb3JlIGVkaXRvcg==
import styled from "styled-components";
import { InputNumber, Slider } from "antd";
import { Icons } from "./DGMIcons";
import { rad2deg } from "@/lib/utils";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  outline: none;
  height: 35px;
`;

const StyledInputNumber = styled(InputNumber)`
  -webkit-user-drag: none;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  outline: none !important;
  position: relative;
  display: flex;
  width: auto;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-color: var(--digimap-inputBorder-color, transparent);
  background: var(--digimap-inputBackground-color, #f3f3f3);
  color: var(--digimap-inputIcon-color, #999999);
  height: 30px;
  border-radius: 8px;
`;

const SliderWrapper = styled.div`
  margin-top: 10px;
  margin-right: 7px;
`;

const StyledSlider = styled(Slider)`
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI,
    Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    Segoe UI Symbol;
  font-size: 12px;
  margin: 0;
  -webkit-appearance: none;
  background-color: transparent;
  height: 30px;
  user-select: text;
  --progress: 27%;
`;

const SuffixIcon = styled.div`
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  outline: none;
  width: auto;
  padding-right: 6px;
  color: var(--digimap-inputLabel-color, #999999);
  font-size: 9px;
  line-height: var(--digimap-label-font-size, 10px);
  pointer-events: none;
  top: 10px;
  margin-left: 47px;
  position: absolute;

  &:hover {
    color: var(--digimap-inputIcon-color, #999999);
  }
`;

type DGMInputNumberProps = {
  type?: "number" | "angle";
  value: number | null;
  min?: number;
  max?: number;
  onChange?: (value: any | null) => void;
  slider?: boolean;
  icon?: string;
  step?: number;
  precision?: number;
  readOnly?: boolean;
  setting?: boolean;
};

export enum INPUT_SETTINGS {
  PRECISION = 2,
  STEP = 0.01,
}

export const DGMInputNumber = ({
  type = "number",
  value,
  min,
  max,
  onChange,
  slider = true,
  icon,
  step,
  precision,
  readOnly,
  setting,
}: DGMInputNumberProps) => {
  const currentValue = value ?? 0;
  const [internalValue, setInternalValue] = useState(currentValue);
  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value ?? 0);
    }
  }, [value]);

  const handleChange = (val: any | null) => {
    if (max && val > max) return;
    setInternalValue(val ?? 0);
    onChange?.(val);
  };

  return (
    <>
      <Wrapper>
        <StyledInputNumber
          variant="borderless"
          value={internalValue}
          onChange={handleChange}
          controls={{
            upIcon: <Icons.UpArrow />,
            downIcon: <Icons.DownArrow />,
          }}
          step={step ?? (setting ? INPUT_SETTINGS.STEP : 1)}
          precision={precision ?? (setting ? INPUT_SETTINGS.PRECISION : 0)}
          min={min ?? 0}
          max={max ?? 100}
          formatter={(current: any) => {
            if (current === undefined) return "";
            if (type === "angle") {
              return `${parseFloat(current).toFixed(
                precision ?? (setting ? INPUT_SETTINGS.PRECISION : 0)
              )}°`;
            } else {
              return `${+parseFloat(current).toFixed(
                precision ?? (setting ? INPUT_SETTINGS.PRECISION : 0)
              )}`;
            }
          }}
          readOnly={readOnly}
        />
        {icon && <SuffixIcon>{icon}</SuffixIcon>}
      </Wrapper>
      {slider && (
        <SliderWrapper>
          <StyledSlider
            min={min ?? 0}
            max={max ?? 100}
            onChange={handleChange}
            step={step ?? (setting ? INPUT_SETTINGS.STEP : 1)}
            value={internalValue}
          />
        </SliderWrapper>
      )}
    </>
  );
};
