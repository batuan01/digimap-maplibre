import styled from "styled-components";
import { Segmented } from "antd";
import {
  InfoCircleOutlined,
  BgColorsOutlined,
  CodepenOutlined,
  FontColorsOutlined,
  FileImageOutlined,
  QrcodeOutlined,
  MergeCellsOutlined,
  CodeSandboxOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { JSX, useEffect, useState } from "react";
import { ICONS } from "../common/Icons";

const Wrapper = styled.div`
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  outline: none;
  position: relative;
  display: grid;
  padding: 10px 12px;

  .ant-segmented-item {
    width: 32px !important;
    height: 32px !important;
  }

  .ant-segmented-item-label {
    padding: 2px 0px !important;
  }
`;

const iconMapping: { [key: string]: JSX.Element } = {
  GLOBAL_GENERAL: <SettingOutlined />,
  GLOBAL_THEME: <BgColorsOutlined />,
  EDITOR_3D: <CodeSandboxOutlined />,
  INFO: <InfoCircleOutlined />,
  MATERIAL: <BgColorsOutlined />,
  GEOMETRY: <CodepenOutlined />,
  TEXT: <FontColorsOutlined />,
  IMAGE: <FileImageOutlined />,
  QR: <QrcodeOutlined />,
  CONNECTION: <MergeCellsOutlined />,
  BEACON: <ICONS.BEACON_MINI />,
};

type DGMToolPanelSwitcherProps = {
  value: string;
  onPageChange: (value: string) => void;
  types: string[];
};

export const DGMToolPanelSwitcher = ({ value, onPageChange, types }: DGMToolPanelSwitcherProps) => {
  const handleOnChangePage = (newValue: string) => {
    onPageChange(newValue);
  };

  if (types.length === 0) return null;

  const options = types.map((type) => ({
    value: type,
    icon: iconMapping[type],
  }));

  return (
    <Wrapper>
      <Segmented value={value} block={true} size="middle" options={options} onChange={handleOnChangePage} />
    </Wrapper>
  );
};
