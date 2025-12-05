import React from 'react';
import './index.css';

function Modal({ image, onClose }) {
    if (!image) return null;

    const handleMaskClick = () => {
        onClose();
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="modal-mask" onClick={handleMaskClick}>
            <div className="modal-mask-bg"></div>
            <div className="modal-content" onClick={handleContentClick}>
                <img
                    src={image.url}
                    alt={image.name}
                    className="modal-image"
                />
                <div className="modal-caption">{image.name}</div>
            </div>
        </div>
    );
}

export default Modal;

