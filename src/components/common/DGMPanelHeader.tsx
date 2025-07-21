// Project: Digimap Core Editor
// Copyright: © 2024 Digimap. All rights reserved.
// ZGlnaW1hcC5haSBjb3JlIGVkaXRvcg==
import styled from "styled-components";
import Gap from "../foundation/Gap";
import { Icons } from "./DGMIcons";
import { DGMPanelActionCollapse, DGMPanelActionIcon } from "./DGMPanelTab";
import { Tooltip } from "antd";
import { ICONS } from "./Icons";

const Wrapper = styled.div<{ $border?: boolean }>`
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  outline: none;
  position: relative;
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 48px;
  padding: 0px 10px;
  flex-direction: row;
  flex-shrink: 0;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
  color: var(--digimap-panelTitle-color, #333333);
  cursor: pointer;
  ${(props) => (props.$border ? "border-top: 1px solid var(--digimap-panelDivider-color, #eeeeee)" : "none")}
`;

const Title = styled.div`
  color: var(--digimap-panelTitle-color, #333333);
  cursor: pointer;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  outline: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
  font-size: var(--digimap-base-font-size, 12px);
  font-weight: var(--digimap-heading-font-weight, 600);
  font-family: Inter, sans-serif !important;
`;

const IconWrapper = styled.div`
  color: var(--digimap-tooltipIcon-color, #bbbbbb);
  cursor: pointer;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  outline: none;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
`;

const ActionWrapper = styled.div`
  display: flex;
`;

const LeftIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  padding-right: 3px;
`;

const RightIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  padding: 0px 3px;
`;

const Spacer = styled.div`
  flex: 1;
`;

const IconWrraper = styled.div<{ selected?: boolean }>`
  transform: ${(props) => (props.selected ? "rotate(0deg)" : "rotate(-90deg)")};
`;

const TitleWrapper = styled.div`
  display: flex;
`;

const StyledImage = styled.img`
  border-radius: var(--border-radius-lg, 4px);
`;

const Description = styled.p`
  margin: 0;
  line-height: 30px;
`;

const style: React.CSSProperties = {
  background: "#fff",
  color: "#000",
  padding: "10px",
};

type DGMDescription = {
  image: string;
  data: {
    title: string;
    description: string;
  }[];
};

type DGMPanelHeaderProps = {
  actionIcons?: DGMPanelActionIcon[];
  label?: String;
  guide?: boolean;
  border?: boolean;
  collapse?: DGMPanelActionCollapse;
  description?: DGMDescription;
};

const dataDescription = {
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Rotating_earth_%28large%29.gif/200px-Rotating_earth_%28large%29.gif",
  data: [
    {
      title: "DGMPanelHeader",
      description: "This is a panel header",
    },
    {
      title: "DGMPanelHeader",
      description: "This is a panel header",
    },
  ],
};

export const DGMPanelHeader = ({
  label,
  guide,
  actionIcons = [],
  border = true,
  collapse,
  description = dataDescription,
}: DGMPanelHeaderProps) => {
  const { isCollapse, onClick, showIcon = true } = collapse || {};

  const { image, data } = description || {};

  const title = (
    <div>
      <StyledImage src={image} width="100%" height="auto" />
      <Gap size={10} />
      {data.map((item, index: number) => (
        <div key={index}>
          <Title>{item.title}</Title>
          <Description>{item.description}</Description>
        </div>
      ))}
    </div>
  );

  return (
    <Wrapper $border={border}>
      {collapse && showIcon && (
        <LeftIconWrapper onClick={onClick}>
          <IconWrraper selected={isCollapse}>
            <ICONS.ARROW_DOWN />
          </IconWrraper>
        </LeftIconWrapper>
      )}
      {description && guide ? (
        <Tooltip
          placement="left"
          title={title}
          // overlayInnerStyle={style}
          mouseLeaveDelay={0.3}
          // overlayClassName="tooltip-description"
        >
          <TitleWrapper>
            <Title onClick={onClick}>{label}</Title>
            <Gap size={10} />
            {guide && (
              <IconWrapper>
                <Icons.Information />
              </IconWrapper>
            )}
          </TitleWrapper>
        </Tooltip>
      ) : (
        <>
          <Title onClick={onClick}>{label}</Title>
          <Gap size={10} />
          {guide && (
            <IconWrapper>
              <Icons.Information />
            </IconWrapper>
          )}
        </>
      )}

      <Spacer />
      <ActionWrapper>
        {actionIcons?.map((icon: DGMPanelActionIcon, index: number) =>
          icon.tooltip ? (
            <Tooltip key={index} placement="bottom" title={<span>{icon.tooltip}</span>}>
              <RightIconWrapper onClick={icon?.onClick}>{icon.icon}</RightIconWrapper>
            </Tooltip>
          ) : (
            <RightIconWrapper key={index} onClick={icon.onClick}>
              {icon.icon}
            </RightIconWrapper>
          )
        )}
      </ActionWrapper>
    </Wrapper>
  );
};
