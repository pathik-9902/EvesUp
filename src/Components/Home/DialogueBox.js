
import React from 'react';

const DialogueBox = ({ isOpen, onClose, children }) => {
  const dialogueBoxStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    border: '1px solid #ccc',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    zIndex: '1000'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  };

  const closeButtonStyle = {
    ...buttonStyle,
    marginTop: '10px'
  };

  if (!isOpen) return null;

  return (
    <div style={dialogueBoxStyle}>
      <div className="dialogue-content">
        {children}
      </div>
      <button style={closeButtonStyle} onClick={onClose}>Close</button>
    </div>
  );
};

export default DialogueBox;
