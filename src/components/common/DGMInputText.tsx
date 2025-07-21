import { Input } from "antd";
import styled from "styled-components";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  width: 100%;
  grid-column: 2 / -1;
`;

const StyledInput = styled(Input)``;

type DGMInputTextProps = {
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

export const DGMInputText = ({
  value,
  defaultValue,
  onChange,
  disabled,
}: DGMInputTextProps) => {
  const [internalValue, setInternalValue] = useState(
    value ?? defaultValue ?? ""
  );

  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value ?? "");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Wrapper>
      <StyledInput
        disabled={disabled}
        value={internalValue}
        onChange={handleChange}
      />
    </Wrapper>
  );
};
