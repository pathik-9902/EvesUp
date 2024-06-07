import React, { useState, useEffect } from "react";
import './Login.css';
import axios from "axios";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import DialogueBox from '../Home/DialogueBox';

const Login = ({ setUserState }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    login: "",  // can be either email or username
    password: "",
  });

  const [showDialogue, setShowDialogue] = useState(false);
  const [dialogueContent, setDialogueContent] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (location.state && location.state.referrer === "/organize") {
      setShowDialogue(true);
      setDialogueContent("You must login first to organize events");
    }
  }, [location.state]);

  const handleCloseDialogue = () => {
    setShowDialogue(false);
    setDialogueContent('');
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  const validateForm = (values) => {
    const error = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.login) {
      error.login = "Username or Email is required";
    } else if (emailRegex.test(values.login) && !emailRegex.test(values.login)) {
      error.login = "Please enter a valid email address";
    }

    if (!values.password) {
      error.password = "Password is required";
    }

    return error;
  };

  const loginHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      axios.post("http://localhost:8000/login", user).then((res) => {
        alert(res.data.message);
        setUserState(res.data.user);
        localStorage.setItem("token", res.data.token); // Store token in localStorage
        navigate("/", { replace: true });
      }).catch(err => {
        console.error("Login Error:", err);
        if (err.response && err.response.status === 401) {
          setLoginError("Invalid username/email or password");
        } else {
          alert("Login failed. Please try again.");
        }
      });
    }
  }, [formErrors, isSubmit, user, setUserState, navigate]);

  return (
    <div className='login form-container'>
      <form id="form-login">
        <h1>Login</h1>
        <input type="text" id="login" name='login' placeholder="Username or Email" onChange={changeHandler} value={user.login}/>
        <p className='error'>{formErrors.login}</p>
        <input type="password" name="password" id="password" placeholder="Password" onChange={changeHandler} value={user.password} />
        <p className='error'>{formErrors.password}</p>
        {loginError && <p className='error'>{loginError}</p>}
        <button className='button_common' onClick={loginHandler}>Login</button>
      </form>
      <NavLink to="/signup">Not yet registered? Register Now</NavLink>
      <DialogueBox isOpen={showDialogue} onClose={handleCloseDialogue}>{dialogueContent}</DialogueBox>
    </div>
  );
};

export default Login;
