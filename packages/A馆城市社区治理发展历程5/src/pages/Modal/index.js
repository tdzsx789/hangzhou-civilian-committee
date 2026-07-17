import React from 'react';
import './index.css';

const formatCaption = (text, language) => {
    if (language !== 'en' || !text || typeof text !== 'string') return text;
  
    const targets = [
      "The Opinions of the CPC Central Committee and the State Council on Strengthening and Improving Urban and Rural Community Governance",
      "The Opinions on Strengthening and Improving the Construction of the Party at the Urban Community Level issued by the General Office of the CPC Central Committee",
      "The Opinions of the CPC Central Committee and the State Council on Strengthening the Modernization of the Community-Level Governance System and Governance Capacity"
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
    const captionText = (image.name && typeof image.name === 'object') ? image.name[language] : image.name;

    return (
        <div className="modal-mask" onClick={handleMaskClick}>
            <div className="modal-mask-bg"></div>
            <div className="modal-content" onClick={handleContentClick}>
                <img
                    src={image.url}
                    alt={captionText}
                    className="modal-image"
                />
                <div className="modal-caption" style={captionStyle}>{formatCaption(captionText, language)}</div>
            </div>
        </div>
    );
}

export default Modal;

