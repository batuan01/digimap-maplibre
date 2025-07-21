// Project: Digimap Core Editor
// Copyright: © 2024 Digimap. All rights reserved.
// ZGlnaW1hcC5haSBjb3JlIGVkaXRvcg==
import { ReactNode } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  outline: none;
  position: relative;
  display: grid;
  width: 100%;
  padding-bottom: 3px;
  column-gap: 10px;
  grid-template-columns: minmax(0, 1.5fr) repeat(2, minmax(62px, 1fr));
  grid-template-rows: auto;
  padding-top: 0;
  height: 35px;
  padding-right: 10px;
`;

const TitleWrapper = styled.div`
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  outline: none;
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  padding-left: 15px;
  height: 30px;
`;

const Title = styled.div<{ $isHighlight?: boolean }>`
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  outline: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--digimap-base-font-size, 12px);
  font-weight: 700;
  line-height: 16px;
  pointer-events: none;
  transition: color 0.2s;
  font-family: Inter, sans-serif !important;
  background: ${(props) => (props.$isHighlight ? "#000" : "none")};
  color: ${(props) => (props.$isHighlight ? "#fff" : "var(--digimap-panelRowTitle-color, #666666)")};
  padding: ${(props) => (props.$isHighlight ? "5px" : "0px")};
`;

const RequiredMessage = styled.span`
  color: #e34a66;
`;

type DGMPanelRowProps = {
  label?: String;
  children: ReactNode;
  required?: boolean;
  isHighlight?: boolean;
};

export const DGMPanelRow = ({ label, children, required, isHighlight }: DGMPanelRowProps) => {
  return (
    <Wrapper>
      <TitleWrapper>
        <Title $isHighlight={isHighlight}>
          {label} {required && <RequiredMessage>*</RequiredMessage>}
        </Title>
      </TitleWrapper>
      {children}
    </Wrapper>
  );
};
