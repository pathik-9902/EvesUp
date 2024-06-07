// EditEventDialog.js
import React, { useState } from 'react';
import './EditEventDialog.css';

const EditEventDialog = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...event });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      imgbuf: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  return (
    <div className="edit-event-dialog">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </label>
        <label>
          Date:
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
        </label>
        <label>
          Location:
          <input type="text" name="location" value={formData.location} onChange={handleChange} />
        </label>
        <label>
          Host:
          <input type="text" name="host" value={formData.host} onChange={handleChange} />
        </label>
        <label>
          Fee:
          <input type="text" name="fee" value={formData.fee} onChange={handleChange} />
        </label>
        <label>
          Image:
          <input type="file" name="imgbuf" onChange={handleFileChange} />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default EditEventDialog;
