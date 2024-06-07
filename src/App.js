import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Components/Home/Navbar';
import Login from './Components/Authentication/Login';
import Register from './Components/Authentication/Register';
import Home from './Components/Home/Home';
import Profile from './Components/Home/Profile/Profile';
import Organize from './Components/Home/Organize/Organize';
import Events from './Components/Home/Events/Events';

function App() {
  const [userState, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.post("http://localhost:8000/verifyToken", { token })
        .then((res) => {
          setUserState(res.data.user);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Token verification error:", err);
          localStorage.removeItem("token");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Router>
        <Navbar userState={userState} setUserState={setUserState} />
        <Routes>
          <Route path="/" element={<Home setUserState={setUserState} userState={userState} />} />
          <Route path="/login" element={<Login setUserState={setUserState} />} />
          <Route path="/profile" element={userState ? <Profile setUserState={setUserState} userState={userState} /> : <Navigate to="/login" />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/organize" element={userState ? <Organize userState={userState} /> : <Navigate to="/login" />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
