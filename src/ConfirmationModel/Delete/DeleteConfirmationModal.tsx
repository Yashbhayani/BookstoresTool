import React from 'react';
import './DeleteConfirmation.css';

interface DeleteConfirmationModalProps {
  show: boolean;
  message: string;
  id: any;
  handleClose: () => void;
  onConfirm: (pid:string) => void;  // Callback for confirmation
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ show, message, id, handleClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
        </div>
        <div className="modal-body">
          <h4>{message}</h4>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose}>No</button>
          <button className="btn btn-primary" onClick={() => { onConfirm(id); handleClose(); }}>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
