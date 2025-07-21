// Project: Digimap Core Editor
// Copyright: © 2024 Digimap. All rights reserved.
// ZGlnaW1hcC5haSBjb3JlIGVkaXRvcg==
import { ReactNode, useState } from "react";
import styled from "styled-components";
import Gap from "../foundation/Gap";
import { DGMPanelHeader } from "./DGMPanelHeader";
// import { PanelTabHeaderInactive, PanelTabHeaderInput } from "./PanelTabHeader";

const PanelTabWrapper = styled.div`
  width: 100%;
  color-scheme: light;
  color: var(--color-text, #333333);
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: inherit;
  outline: none;
  letter-spacing: inherit;
  text-decoration: none;
  cursor: inherit;
  user-select: none;
  gap: 5px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export type DGMPanelActionIcon = {
  icon: React.ReactNode;
  name: string;
  tooltip?: string;
  onClick?: (value?: any) => void;
};

export type DGMPanelActionCollapse = {
  isCollapse: boolean;
  onClick?: () => void;
  showIcon?: boolean;
};

type DGMPanelTabProps = {
  actionIcons?: DGMPanelActionIcon[];
  label?: String;
  children: ReactNode;
  onClose?: boolean;
  guide?: boolean;
  border?: boolean;
  collapse?: DGMPanelActionCollapse;
};

export const DGMPanelTab = ({
  actionIcons = [],
  label,
  children,
  onClose,
  guide,
  border = true,
  collapse,
}: DGMPanelTabProps) => {
  return (
    <PanelTabWrapper>
      <DGMPanelHeader actionIcons={actionIcons} label={label} guide={guide} border={border} collapse={collapse} />
      {collapse ? (
        collapse.isCollapse ? (
          <>
            {children}
            <Gap size={10} />
          </>
        ) : null
      ) : (
        children
      )}
    </PanelTabWrapper>
  );
};

export const PanelTabInput = ({
  renderAction,
  children,
  item,
  setDataName,
}: {
  renderAction: any;
  children: ReactNode;
  item: any;
  setDataName: Function;
}) => {
  const [isCollapse, setIsCollapse] = useState(item.status);

  const onClickCollapse = () => {
    setIsCollapse(!isCollapse);
  };

  return (
    <PanelTabWrapper>
      {/* <PanelTabHeaderInput isCollapse={isCollapse} renderAction={renderAction} item={item} setDataName={setDataName} /> */}
      {!isCollapse && <div style={{ marginBottom: "20px" }}>{children}</div>}
    </PanelTabWrapper>
  );
};

export const PanelTabInactive = ({
  renderAction,
  children,
  item,
  setDataName,
}: {
  renderAction: any;
  children: ReactNode;
  item: any;
  setDataName: Function;
}) => {
  const [isCollapse, setIsCollapse] = useState(item.status);

  const onClickCollapse = () => {
    setIsCollapse(!isCollapse);
  };

  return (
    <PanelTabWrapper>
      {/* <PanelTabHeaderInactive
        isCollapse={isCollapse}
        renderAction={renderAction}
        item={item}
        setDataName={setDataName}
      /> */}
      {!isCollapse && <div style={{ marginBottom: "20px" }}>{children}</div>}
    </PanelTabWrapper>
  );
};
