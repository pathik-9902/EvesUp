import React from 'react';

const Modal = ({ event, onClose }) => {
  const { title, date, description, location, imgbuf, host, fee, userId } = event;

  const imgBlob = imgbuf ? new Blob([new Uint8Array(imgbuf.data)]) : null;
  const imgUrl = imgBlob ? URL.createObjectURL(imgBlob) : '';

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyles} onClick={onClose} aria-label="Close Modal">✖</button>
        {imgUrl && <img src={imgUrl} alt='Event' style={styles.image_style} />}
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.date}>{new Date(date).toLocaleDateString()}</p>
        <p style={styles.description}>{description}</p>
        <p style={styles.host}>Organizer: {host}</p>
        <p style={styles.location}>{location}</p>
        <p style={styles.fee}>
          {fee ? `Fee: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(fee)}` : 'Free'}
        </p>
        <p style={styles.userId}>#{userId}</p>
      </div>
    </div>
  );
};

const closeButtonStyles = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  cursor: 'pointer',
  border: 'none',
  backgroundColor: 'transparent',
  fontSize: '24px',
  color: '#888',
  transition: 'color 0.3s ease',
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '80%',
    position: 'relative',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  image_style: {
    objectFit: 'cover',
    marginBottom: '16px',
    borderRadius: '8px',
    width: '100%',
    maxHeight: '200px',
    backgroundColor: '#f0f0f0',
    color: '#888',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '24px',
  },
  date: {
    margin: '0 0 16px 0',
    color: '#555',
  },
  description: {
    margin: '0 0 16px 0',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  location: {
    margin: '0',
    fontWeight: 'bold',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  host: {
    margin: '8px 0',
    fontSize: '16px',
    color: '#555',
  },
  fee: {
    margin: '0',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '16px',
  },
  userId: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    backgroundColor: '#333',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
  },
};

export default Modal;
