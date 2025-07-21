import { COLORS_SUGGESTION } from "@/constants/constants";
import { ColorPicker, ColorPickerProps } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div``;

type Presets = Required<ColorPickerProps>["presets"][number];
type DGMColorPickerProps = {
  value: string;
  handleChange: Function;
};

// Generate presets for the color picker
const generatePresets = (
  customPresets: Array<{ label: string; colors: string[] }>
): Presets[] =>
  customPresets.map(({ label, colors }) => ({
    label,
    colors,
  }));

const getStoredColors = () =>
  JSON.parse(localStorage.getItem("colors") || "[]");

// Add a new color to the recently used colors list
export const addColorToStorage = (color: string, colors: string[]) => {
  if (!colors.includes(color)) {
    colors.push(color);
    if (colors.length > 20) {
      colors.shift();
    }
    localStorage.setItem("colors", JSON.stringify(colors));
  }
};

export const DGMColorPicker = ({
  value,
  handleChange,
}: DGMColorPickerProps) => {
  const storedColors = getStoredColors();
  const [internalValue, setInternalValue] = useState(value);

  const customColors = [
    { label: "Suggestions", colors: COLORS_SUGGESTION[0].colors },
    { label: "Recently Selected", colors: storedColors },
  ];

  const presets = generatePresets(customColors);

  // @NOTE: - Path Color
  let colorChangeTimer: ReturnType<typeof setTimeout>;
  let colorChangeCount = 0;

  const handleColorChange = (color: any, storedColors: string[]) => {
    clearTimeout(colorChangeTimer);
    colorChangeCount++;
    colorChangeTimer = setTimeout(() => {
      if (colorChangeCount > 0) {
        handleChange(color);
        addColorToStorage(color.toHexString(), storedColors);
        colorChangeCount = 0;
      }
    }, 100);
  };

  const handleChangeColor = (color: any, storedColors: string[]) => {
    setInternalValue(color.toHexString());
    handleColorChange(color, storedColors);
  };

  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value ?? 0);
    }
  }, [value]);
  return (
    <Wrapper>
      <ColorPicker
        arrow={false}
        presets={presets}
        showText
        value={internalValue}
        onChange={(e) => handleChangeColor(e, storedColors)}
        placement={"topLeft"}
      />
    </Wrapper>
  );
};
