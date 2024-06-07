import './Organize.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../config';


const Organize = ({ userState }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    location: '',
    imgbuf: null,
    host: '',
    fee: '',
    userId: "",
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Check if the input is for fee and if the value matches the allowed pattern
    if (name === 'fee' && !/^\d*\.?\d*$/.test(value)) {
      return; // Do not update the state if the value is invalid
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'imgbuf' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('date', formData.date);
      form.append('description', formData.description);
      form.append('location', formData.location);
      form.append('imgbuf', formData.imgbuf);
      form.append('host', formData.host);
      form.append('userId', userState.userId);
      form.append('fee', formData.fee);
  
      const response = await fetch(`${API_BASE_URL}/organizer`, {
        method: "POST",
        body: form
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create event: ${response.statusText}`);
      }
  
      const data = await response.json();
      alert(data.message);
  
      setFormData({
        title: '',
        date: '',
        description: '',
        location: '',
        imgbuf: null,
        host: '',
        fee: '',
        userId: '',
      });
    } catch (error) {
      console.error("Error creating event:", error);
      setErrorMessage("Error creating event. Please try again later.");
    }
  };
  

  const navigate = useNavigate();

  useEffect(() => {
    if (!userState) {
      navigate("/login", { state: { referrer: "/organize" } });
    }
  }, [userState, navigate]);

  return (
    <div className="event-form">
      <form name='event-form' className="event-form__form" onSubmit={handleSubmit}>
        <h2>Create Event</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="form-group">
          <label htmlFor="title">Title:</label><br />
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label><br />
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label><br />
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="location">Location:</label><br />
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="host">Event Host:</label><br />
          <input type="text" id="host" name="host" value={formData.host} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="fee">Event Fee:</label><br />
          <input type="text" id="fee" name="fee" value={formData.fee} onChange={handleChange} required pattern="\d*\.?\d*" />
        </div>
        <div className="form-group">
          <label htmlFor="photo">Photo:</label><br />
          <div className="file-input-container">
            <span className="file-input-label">Choose file...</span>
            <input type="file" id="photo" name="imgbuf" className="file-input" accept="image/*" onChange={handleChange} required />
          </div>
          {formData.imgbuf && (
            <p className="uploaded-file">
              <span className="uploaded-file-symbol">&#10003;</span>
              Selected file: {formData.imgbuf.name}
            </p>
          )}
        </div>
        <button className='button-primary' type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default Organize;
