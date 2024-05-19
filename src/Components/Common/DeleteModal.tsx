import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";

interface DeleteModalProps {
  show?: boolean;
  onDeleteClick?: () => void;
  onCloseClick?: () => void;
  recordId?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ show, onDeleteClick, onCloseClick, recordId }) => {
  return (
    <Modal fade={true} isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalHeader toggle={onCloseClick}>Confirm Delete</ModalHeader>
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center">
          <i className="ri-delete-bin-line display-5 text-danger"></i>
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <p className="text-muted mx-4 mb-0">
              Are you sure you want to remove this record {recordId ? recordId : ""}?
            </p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onCloseClick}>
          Cancel
        </Button>
        <Button color="danger" onClick={onDeleteClick}>
          Yes, Delete It!
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteModal;
