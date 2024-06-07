import React, { useEffect, useState } from "react";
import '../Authentication/Login.css'
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();  

  const [formResp, setFormResp] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    username: "", fname: "", lname: "", email: "", password: "", cpassword: "", acStat: "active",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user, [name]: value,
    });
  };

  const validateForm = (values) => {
    const resp = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    
    if (!values.username) {
      resp.username = "Username is required";
    }
    if (!values.fname) {
      resp.fname = "First Name is required";
    }
    if (!values.lname) {
      resp.lname = "Last Name is required";
    }
    if (!values.email) {
      resp.email = "Email is required";
    } else if (!regex.test(values.email)) {
      resp.email = "This is not a valid email format!";
    }
    if (!values.password) {
      resp.password = "Password is required";
    } else if (values.password.length < 4) {
      resp.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      resp.password = "Password cannot exceed more than 10 characters";
    }
    if (!values.cpassword) {
      resp.cpassword = "Confirm Password is required";
    } else if (values.cpassword !== values.password) {
      resp.cpassword = "Confirm password and password should be same";
    }
    return resp;
  };


  const signupHandler = (e) => {

    e.preventDefault();
    setFormResp(validateForm(user));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formResp).length === 0 && isSubmit) {
      console.log(user);
      axios.post("http://localhost:8000/signup/", user).then((res) => {
        alert(res.data.message);
        navigate("/login", { replace: true });
      });
    }
  }, [formResp, isSubmit, user, navigate]);

  return (
    <>
      <div className='register form-container'>
        <form id="register">
          <h1>Create your account</h1>
          <input type="text" name="username" id="username" placeholder="Username" onChange={changeHandler} value={user.username}/>
          <p className='resp'>{formResp.username}</p>
          <input type="text" name="fname" id="fname" placeholder="First Name" onChange={changeHandler} value={user.fname}/>
          <p className='resp'>{formResp.fname}</p>
          <input type="text" name="lname" id="lname" placeholder="Last Name" onChange={changeHandler} value={user.lname}/>
          <p className='resp'>{formResp.lname}</p>
          <input type="email" name="email" id="email" placeholder="Email" onChange={changeHandler} value={user.email}/>
          <p className='resp'>{formResp.email}</p>
          <input type="password" name="password" id="password" placeholder="Password" onChange={changeHandler} value={user.password}/>
          <p className='resp'>{formResp.password}</p>
          <input type="password" name="cpassword" id="cpassword" placeholder="Confirm Password" onChange={changeHandler} value={user.cpassword}/>
          <p className='resp'>{formResp.cpassword}</p>
          <button className='button_common' onClick={signupHandler}>Register</button>
        </form>
        <NavLink to="/login">Already registered? Login</NavLink>
      </div>
    </>
  );
};

export default Register;
