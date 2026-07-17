import React from 'react';
import './index.css';

function Modal({ image, onClose, language }) {
    if (!image) return null;

    const handleMaskClick = () => {
        onClose();
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const captionStyle = language !== 'zh' ? { textIndent: '0' } : {};

    return (
        <div className="modal-mask" onClick={handleMaskClick}>
            <div className="modal-mask-bg"></div>
            <div className="modal-content" onClick={handleContentClick}>
                <img
                    src={image.url}
                    alt={image.name}
                    className="modal-image"
                />
                <div className="modal-caption" style={captionStyle}>{image.name}</div>
            </div>
        </div>
    );
}

export default Modal;

