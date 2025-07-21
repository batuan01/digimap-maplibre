import { Segmented } from "antd";
import { SegmentedLabeledOption } from "antd/es/segmented";
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
  border: 1px solid var(--digimap-segmentedControlBorder-color, transparent);
  background-color: var(--fdigimap-segmentedControlBackground-color, #f3f3f3);
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
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -2px;
  }

  .ant-segmented-item-selected {
    background-color: #ffffff;
  }

  .ant-segmented-item-selected > .ant-segmented-item-label {
    color: var(--digimap-segmentedControlItemTextSelected-color, #0099ff) !important;
  }

  .ant-segmented-thumb {
    background-color: #ffffff;
  }

  .ant-segmented-item-icon {
    margin-top: 6px;
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

type DGMBasicSegmentProps<T> = {
  onValueChange?: (value: T) => void;
  defaultValue?: T;
  value?: T;
  types: [SegmentedLabeledOption<T>, SegmentedLabeledOption<T>];
  width?: number;
  height?: number;
  disabled?: boolean;
};

export const DGMBasicSegment = <T,>({
  onValueChange,
  value,
  defaultValue,
  types,
  width,
  height,
  disabled,
}: DGMBasicSegmentProps<T>) => {
  const handleOnChangePage = (value: T) => {
    onValueChange?.(value);
  };

  return (
    <Wrapper style={{ width: width, height: height }}>
      <StyledSegment
        defaultValue={defaultValue}
        value={value}
        block={true}
        size="middle"
        options={types}
        onChange={handleOnChangePage as any}
        disabled={disabled}
      />
    </Wrapper>
  );
};
