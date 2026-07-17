import React from 'react';
import './index.css';

const formatCaption = (text, language) => {
    if (language !== 'en' || !text || typeof text !== 'string') return text;
  
    const targets = [
      "The Circular of the General Office of the CPC Central Committee and the General Office of the State Council on Forwarding the Opinions of the Ministry of Civil Affairs on Promoting Urban Community Construction Nationwide",
      "The Circular of the General Office of the CPC Central Committee Forwarding the Opinions of the Organization Department of the CPC Central Committee on Further Strengthening and Improving the Party Building Work in Sub-districts and Communities"
    ];
  
    let parts = [text];
    
    targets.forEach(target => {
      const newParts = [];
      parts.forEach(part => {
        if (typeof part === 'string') {
          const split = part.split(target);
          split.forEach((s, i) => {
            if (s) newParts.push(s);
            if (i < split.length - 1) {
              newParts.push(<i key={target + i}>{target}</i>);
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });
  
    return parts;
  };

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
                <div className="modal-caption" style={captionStyle}>{formatCaption(image.name, language)}</div>
            </div>
        </div>
    );
}

export default Modal;

