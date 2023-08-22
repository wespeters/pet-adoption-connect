import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
    contactinfo: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5555/users", formData);
      if (response.data) {
        navigate("/");
        console.log("Registration successful:", response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="register-section">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <p><input name="username" type="text" placeholder="Username" onChange={handleChange} /></p>
        <p><input name="password" type="password" placeholder="Password" onChange={handleChange} /></p>
        <p><input name="email" type="email" placeholder="Email" onChange={handleChange} /></p>
        <p><select name="role" onChange={handleChange}>
          <option value="" disabled selected>Select Role</option>
          <option value="owner">Owner</option>
          <option value="adopter">Adopter</option>
        </select></p>
        <p><textarea name="contactinfo" rows="5" cols="50" placeholder="Contact Information" onChange={handleChange}></textarea></p>
        <p><button className='task-button' type="submit">Register</button></p>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Register;
