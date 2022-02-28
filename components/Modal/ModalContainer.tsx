import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import ModalMask from "./ModalMask";

const ModalContainer = ({ children, onClose }) => (
  <>
    <ModalMask />
    <div className="modal-container">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-header-close" onClick={(e) => onClose()}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
        <div className="modal-view">{children}</div>
      </div>
    </div>
  </>
);

export default ModalContainer;
