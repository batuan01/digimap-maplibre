import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import styled from "styled-components";

const Wrapper = styled.div``;

type DGMCustomModalProps = {
  open: boolean;
  width?: number;
  height?: number;
  children: React.ReactNode;
  handleCancel?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const DGMCustomModal = ({ open = false, width, height, children, handleCancel }: DGMCustomModalProps) => {
  const [modalKey, setModalKey] = useState(0);

  useEffect(() => {
    if (open) {
      setModalKey((prevKey) => prevKey + 1);
    }
  }, [open]);

  return (
    <Wrapper key={modalKey}>
      <Modal
        className="digimap-modal-content"
        width={width}
        height={height}
        centered
        open={open}
        footer={null}
        title={null}
        closable={false}
        onCancel={handleCancel ? handleCancel : undefined}
      >
        {children}
      </Modal>
    </Wrapper>
  );
};
