import React, { useState, useEffect, useCallback } from 'react';
import './Profile.css';
import EventCard from '../Events/EventCard';
import EditEventDialog from './EditEventDialog';
import API_BASE_URL from '../config';

const Profile = ({ setUserState, userState, event, onEdit }) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...userState });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showUserEvents, setShowUserEvents] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [deletedEvents, setDeletedEvents] = useState([]);

  const handleDelete = async (event) => {
    try {
      await fetch(`${API_BASE_URL}/api/events/${event._id}`, {
        method: 'DELETE',
      });
      // Assuming your server responds with success
      alert('Event deleted successfully');
      // Here, you can also transfer the event to the DeletedEvent schema
      setDeletedEvents([...deletedEvents, event]); // Add the deleted event to the deletedEvents state
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event. Please try again later.");
    }
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    setEditedProfile({ ...userState });
  }, [userState]);

  const fetchUserEvents = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/user?userId=${userState.userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setUserEvents(data);
    } catch (error) {
      console.error("Error fetching user events:", error);
      alert("Error fetching user events. Please try again later.");
    }
  }, [userState.userId]);

  useEffect(() => {
    fetchUserEvents();
  }, [fetchUserEvents]);

  const handleMyEventsClick = () => {
    setShowUserEvents(!showUserEvents);
    if (!showUserEvents) {
      fetchUserEvents();
    }
  };

  const deactivate = async () => {
    try {
      const response = await fetch('${API_BASE_URL}/deactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userState.userId }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        handleLogout();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deactivating account:", error);
      alert("Error deactivating account. Please try again later.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserState(null);
  };

  const handleProfileEditToggle = () => {
    setEditingProfile(!editingProfile);
    setShowPasswordChange(false);
  };

  const handleProfileSave = async () => {
    try {
      const response = await fetch('${API_BASE_URL}/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfile),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setEditingProfile(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('${API_BASE_URL}/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userState.userId,
          ...passwordData,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordChange(false);
      } else {
        setPasswordError(data.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError("Error changing password. Please try again later.");
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditEvent = (event) => {
    setEditEvent(event);
  };

  const handleSaveEvent = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchUserEvents();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Error updating event. Please try again later.");
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-details">
        <p><strong>User Id:</strong> #{userState.userId}</p>
        <p><strong>User Name:</strong> {userState.username}</p>
        <p><strong>Full Name:</strong> {userState.fname} {userState.lname}</p>
        <p><strong>Email:</strong> {userState.email}</p>
      </div>
      <div className="profile-actions">
        <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
        <button className="btn btn-edit-profile" onClick={handleProfileEditToggle}>
          {editingProfile ? "Cancel Edit" : "Edit Profile"}
        </button>
        <button className="btn btn-my-events" onClick={handleMyEventsClick}>
          {showUserEvents ? "Hide My Events" : "Show My Events"}
        </button>
      </div>

      {/* Profile Editing Dialog */}
      {editingProfile && (
        <div className="dialog dialog-edit-profile">
          <h2>Edit Profile</h2>
          <label>First Name: <input type="text" name="fname" value={editedProfile.fname} onChange={handleInputChange} /></label>
          <label>Last Name: <input type="text" name="lname" value={editedProfile.lname} onChange={handleInputChange} /></label>
          <button className="btn btn-save" onClick={handleProfileSave}>Save</button>
          <button className="btn btn-deactivate" onClick={deactivate}>Deactivate Account</button>
          <button className="btn btn-change-password" onClick={() => setShowPasswordChange(!showPasswordChange)}>
            {showPasswordChange ? "Cancel Change Password" : "Change Password"}
          </button>

          {/* Password Change Dialog */}
          {showPasswordChange && (
            <div className="dialog dialog-change-password">
              <h2>Change Password</h2>
              <label>Current Password: <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordInputChange} /></label>
              <label>New Password: <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordInputChange} /></label>
              <label>Confirm Password: <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordInputChange} /></label>
              {passwordError && <p className="error">{passwordError}</p>}
              <button className="btn btn-change" onClick={handleChangePassword}>Change Password</button>
            </div>
          )}
        </div>
      )}
      {showUserEvents && (
        <div className="user-events">
          <h3>My Events</h3>
          <div className="event-container">
            {userEvents.length === 0 ? (
              <p>No events found for user #{userState.userId}</p>
            ) : (
              userEvents.map(event => (
                <div key={event._id} className="event">
                  <EventCard key={event._id} event={event} showEditButton={true} onEdit={(editedEvent) => handleEditEvent(editedEvent)} onDelete={(deletedEvent) => handleDelete(deletedEvent)} showDeleteButton={true}/>                
                  </div>
              ))
            )}
          </div>
        </div>
      )}
      {editEvent && (
        <EditEventDialog event={editEvent} onClose={() => setEditEvent(null)} onSave={handleSaveEvent} />
      )}
    </div>
  );
};

export default Profile;