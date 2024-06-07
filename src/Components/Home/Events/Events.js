import React, { useState, useEffect } from 'react';
import './Events.css';
import EventCard from './EventCard';


const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  return (
    <div className="event-container">
      {events.map((event, index) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  );
};

export default Events;
