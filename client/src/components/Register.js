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
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="register-section">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <p><input className="input" name="username" type="text" placeholder="Username" onChange={handleChange} /></p>
        <p><input className="input" name="password" type="password" placeholder="Password" onChange={handleChange} /></p>
        <p><input className="input" name="email" type="email" placeholder="Email" onChange={handleChange} /></p>
        <p><select className="input" name="role" value={formData.role} onChange={handleChange}>
          <option value="" disabled>Select Role</option>
          <option value="owner">Owner</option>
          <option value="adopter">Adopter</option>
        </select>
        </p>
        <p><textarea className="contact-information-textarea" name="contactinfo" rows="5" cols="50" placeholder="Contact Information" onChange={handleChange}></textarea></p>
        <p><button className="button button-secondary" type="submit">Register</button></p>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Register;
