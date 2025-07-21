import styled from "styled-components";

const TitleWrapper = styled.div`
  color-scheme: light;
  color: var(--color-text, #333);
  user-select: none;
  margin: 0;
  padding-left: 4px;
  border: 0;
  font: inherit;
  vertical-align: inherit;
  outline: none;
  letter-spacing: inherit;
  text-decoration: none;
  cursor: inherit;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: var(--input-title-height, #333);
  justify-content: flex-start;
  overflow-x: auto;
  word-break: keep-all;
  overflow: hidden;
`;

const TitleText = styled.div`
  color: var(--color-text, #333);
  user-select: none;
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: inherit;
  outline: none;
  letter-spacing: inherit;
  text-decoration: none;
  cursor: inherit;
  width: 100%;
  font-size: 11px;
  font-weight: 600;
  align-self: center;
  grid-column-start: 1;
  grid-column-end: span 10;
  padding-left: 8px;
  span {
    color: red;
  }
`;

type TitleProps = {
  label?: string;
  require?: boolean;
};

const PanelComponentTitle = ({ label, require }: TitleProps) => {
  return (
    <TitleWrapper>
      <TitleText>
        {label} {require && <span>*</span>}
      </TitleText>
    </TitleWrapper>
  );
};

export default PanelComponentTitle;
