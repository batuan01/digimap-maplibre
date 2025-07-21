import { Button, Form, Modal } from "antd";

export const ModalDelete = ({
  fullTitle,
  title,
  isModalDelete,
  setIsModalDelete,
  onClickDelete,
}: {
  fullTitle?: string;
  title?: string;
  isModalDelete: boolean;
  setIsModalDelete: any;
  onClickDelete: any;
}) => {
  const handleCloseModal = () => {
    setIsModalDelete(!isModalDelete);
  };

  return (
    <Modal
      title={"Confirm Delete"}
      centered
      open={isModalDelete}
      onCancel={handleCloseModal}
      footer={[
        <Button key="cancel" onClick={handleCloseModal}>
          Cancel
        </Button>,
        <Button key="confirm" type="primary" danger onClick={onClickDelete}>
          Delete
        </Button>,
      ]}
    >
      <Form>
        <p>
          {fullTitle ? fullTitle : "Are you sure you want to delete " + title} ?
        </p>
      </Form>
    </Modal>
  );
};
