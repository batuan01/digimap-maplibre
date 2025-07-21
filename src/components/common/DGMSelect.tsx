// Project: Digimap Core Editor
// Copyright: © 2024 Digimap. All rights reserved.
// ZGlnaW1hcC5haSBjb3JlIGVkaXRvcg==
import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import styled from "styled-components";
import { Icons } from "./DGMIcons";
import { useEffect, useState } from "react";

const Wrapper = styled.div<{ $type?: "small" | "large" }>`
  width: 100%;
  ${(props) => {
    if (props.$type === "large") {
      return `
        grid-column: 2 / -1;
      `;
    }
    return ``;
  }};

  .ant-select-selector {
    padding: 6px !important;
  }
`;

const SelectWrapper = styled.div`
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  outline: none;
  position: relative;
  width: 100%;
  background-color: var(--digimap-popupButtonBackground-color, #f3f3f3);
  background-position: center;
  background-position-x: calc(100% - 8px);
  background-repeat: no-repeat;
  border-radius: 8px;
`;

const StyledSelect = styled(Select)`
  width: 100%;
`;

type DGMSelectProps = {
  options?: DefaultOptionType[];
  type?: "small" | "large";
  value?: string | null;
  onChange?: (value: string) => void;
  disabled?: boolean;
  showSearch?: boolean;
};

export const DGMSelect = ({
  value,
  onChange,
  options,
  type = "large",
  disabled,
  showSearch,
}: DGMSelectProps) => {
  const [internalValue, setInternalValue] = useState(value);

  // Cập nhật internalValue khi value props thay đổi
  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (val: any) => {
    setInternalValue(val);
    onChange?.(val);
  };

  return (
    <>
      <Wrapper $type={type}>
        <SelectWrapper>
          <StyledSelect
            disabled={disabled}
            value={internalValue}
            variant="borderless"
            suffixIcon={<Icons.InputArrowDown />}
            options={options}
            onChange={handleChange}
            showSearch={showSearch}
          />
        </SelectWrapper>
      </Wrapper>
    </>
  );
};
