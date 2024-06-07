import React, { useState } from 'react';
import Modal from './Modal';

const EventCard = ({ event, showEditButton, onEdit, onDelete, showDeleteButton }) => {
  const { title, date, description, location, imgbuf, host, userId, fee } = event;
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const imgBlob = imgbuf ? new Blob([new Uint8Array(imgbuf.data)]) : null;
  const imgUrl = imgBlob ? URL.createObjectURL(imgBlob) : '';

  const handleDeleteClick = () => {
    onDelete(event);
  };

  return (
    <div style={styles.card}>
      {imgUrl && <img src={imgUrl} alt='Event' style={styles.image_style} loading="lazy" />}
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.date}>{new Date(date).toLocaleDateString()}</p>
      <p style={styles.description}>
        {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        {description.length > 100 && (
          <button onClick={toggleModal} style={styles.readMoreButton}>
            Read More
          </button>
        )}
      </p>
      <p style={styles.host}>Organizer: {host}</p>
      <p style={styles.location}>{location}</p>
      <p style={styles.fee}>
        {fee ? `Fee: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(fee)}` : 'Free'}
      </p>
      <p style={styles.userId}>#{userId}</p>
      {showModal && <Modal event={event} onClose={toggleModal} />}<br/><br/>
      {showEditButton && <button style={styles.editButton} onClick={() => onEdit(event)}>Edit</button>}
      {showDeleteButton && <button style={styles.deleteButton} onClick={handleDeleteClick}>Delete</button>}
    </div>
  );
};

const styles = {
  card: {
    position: 'relative',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    width: '100%',
    maxWidth: '350px',
    margin: '16px auto',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    transition: 'box-shadow 0.3s',
    overflow: 'hidden',
  },
  image_style: {
    objectFit: 'cover',
    marginBottom: '16px',
    borderRadius: '8px 8px 0 0',
    width: '100%',
    height: '200px',
    backgroundColor: '#f0f0f0',
    color: '#888',
    transition: 'transform 0.3s',
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
  title: {
    margin: '0 0 8px 0',
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    margin: '0 0 16px 0',
    color: '#555',
    fontSize: '14px',
  },
  description: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#666',
    minHeight: '50px',
    overflowWrap: 'break-word',
  },
  location: {
    margin: '0',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '16px',
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
  readMoreButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#007bff',
    cursor: 'pointer',
    position: 'absolute',
    bottom: '40px',
    right: '16px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '14px',
    transition: 'background-color 0.3s',
  },
  editButton: {
    border: 'none',
    backgroundColor: '#3498db',
    color: '#fff',
    cursor: 'pointer',
    position: 'absolute',
    bottom: '16px',
    right: '16px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '14px',
    transition: 'background-color 0.3s',
  },
  deleteButton: {
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '14px',
    transition: 'background-color 0.3s',
  },
};

export default EventCard;
