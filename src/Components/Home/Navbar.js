import './Navbar.css';
import React from 'react';
import { NavLink } from 'react-router-dom';
import search from '../Images/search.png'; 

const Navbar = ({ userState }) => {


  const getInitials = (fname, lname) => {
    if (!fname || !lname) return '';
    return `${fname[0]}${lname[0]}`.toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">EvesUp</NavLink>
      </div>
      <div className="navbar-links">
        <ul>
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {userState ? (
            <>
              <li>
                <NavLink to="/organize">Organize</NavLink>
              </li>
              <li>
                <div className="profile-icon">
                  <NavLink to="/profile">
                    <div className="profile-initials">
                      {getInitials(userState.fname, userState.lname)}
                    </div>
                  </NavLink>
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/signup" className="signup-btn">Sign-Up</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="search-bar">
        <button type="button">
          <img src={search} alt="search" />
        </button>
        <input type="text" placeholder="Search..." />
      </div>
    </nav>
  );
};

export default Navbar;
