import { Segmented } from "antd";
import { SegmentedLabeledOption } from "antd/es/segmented";
import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  outline: none;
  display: flex;
  overflow: visible;
  height: var(--height);
  flex-direction: row;
  //   border: 1px solid var(--digimap-segmentedControlBorder-color, transparent);
  background-color: #0099ff;
  cursor: default;
  text-align: center;
  user-select: none;
  border-radius: 8px;
  height: 30px;
  grid-column: 2 / -1;

  .ant-segmented {
    width: 100%;
  }

  .ant-segmented-item-label {
    pointer-events: all;
    color-scheme: light;
    font: inherit;
    letter-spacing: inherit;
    list-style: none;
    font-family: Inter, sans-serif !important;
    min-height: 28px;
    padding: 1px 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    --height: 30px;
    white-space: nowrap;
    font-size: var(--digimap-base-font-size, 12px);
    line-height: 22px;
    color: var(--digimap-segmentedControlItemTextSelected-color, #0099ff);
    font-weight: var(--digimap-heading-font-weight, 600);
    cursor: pointer;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    user-select: none;
    outline: none;
    min-width: 0;
  }

  .ant-segmented-item-label {
    text-align: center;
    --height: 30px;
    white-space: nowrap;
    font-size: var(--digimap-base-font-size, 12px);
    line-height: 22px;
    color: var(--digimap-segmentedControlItemText-color, #0099ff);
    font-weight: var(--digimap-heading-font-weight, 600);
    cursor: pointer;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    user-select: none;
    outline: none;
    min-width: 0;
  }

  .ant-segmented-item-selected {
    background-color: #0099ff;
  }

  .ant-segmented-item-selected > .ant-segmented-item-label {
    color: #fff !important;
  }

  .ant-segmented-thumb {
    background-color: #ffffff;
  }
`;

const StyledSegment = styled(Segmented)`
  // box-sizing: border-box;
  // -webkit-font-smoothing: antialiased;
  // user-select: none;
  // outline: none;
  // position: relative;
  // display: grid;
  // padding-top: 5px;
  // padding-bottom: 5px;
`;

type DGMPPublishSegmentProps<T> = {
  onValueChange?: (value: T) => void;
  defaultValue?: T;
  types: [SegmentedLabeledOption<T>, SegmentedLabeledOption<T>];
};

export const DGMPPublishSegment = <T,>({ onValueChange, defaultValue, types }: DGMPPublishSegmentProps<T>) => {
  const [value, setValue] = useState<SegmentedLabeledOption<T> | undefined>(undefined);

  const handleOnChangePage = (value: T) => {
    onValueChange?.(value);
    setValue(types.find((type) => type.value === value));
  };

  return (
    <Wrapper>
      <StyledSegment
        defaultValue={defaultValue}
        value={value?.value}
        block={true}
        size="middle"
        options={types}
        onChange={handleOnChangePage as any}
      />
    </Wrapper>
  );
};
