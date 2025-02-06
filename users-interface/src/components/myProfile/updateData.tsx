import { Modal } from "antd";
import { close } from "node:fs";

interface Props {
  openModal: boolean;
  closeModal: () => void;
}

function EditModal({ openModal, closeModal }: Props) {
  const update = () => {
    closeModal();
    console.log("Ok");
  };

  return (
    <Modal
      title="Edit User Data"
      open={openModal}
      okText="Update"
      onOk={() => update()}
      onCancel={() => closeModal()}
    >
      <p>{"modalText"}</p>
    </Modal>
  );
}

export default EditModal;
