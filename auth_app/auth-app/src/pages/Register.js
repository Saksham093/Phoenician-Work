// src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    department: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

    const [showVerificationDialog, setShowVerificationDialog] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.first_name) formErrors.first_name = "First name is required";
    if (!formData.last_name) formErrors.last_name = "Last name is required";
    if (!formData.department) formErrors.department = "Department is required";
    if (!formData.email) formErrors.email = "Email is required";
    if (!formData.password) formErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      formErrors.confirmPassword = "Passwords do not match";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Convert department to an integer before sending
        const payload = {
            ...formData,
            department: parseInt(formData.department, 10)
          };

        const response = await axios.post('http://localhost:8000/api/register/', payload);
        alert(response.data.message);
        setEmail(formData.email); // Save the email for verification
        setShowVerificationDialog(true); // Show the dialog box
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          department: '',
        });
      } catch (error) {
        console.error("Error during registration:", error.response.data);
        alert('Error during registration');
      }
    }
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/verify-code/', {
        email: email,
        code: verificationCode
      });
      alert(response.data.message);
      if (response.data.success) {
        setShowVerificationDialog(false); // Hide the dialog box on success
      }
    } catch (error) {
      alert('Invalid verification code');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
        />
        {errors.first_name && <p className="error">{errors.first_name}</p>}

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
        />
        {errors.last_name && <p className="error">{errors.last_name}</p>}

        <select name="department" value={formData.department} onChange={handleChange}>
          <option value="">Select Department</option>
          <option value="1">IT</option> {/* Use department IDs */}
          <option value="2">HR</option>
          <option value="3">Finance</option>
          {/* Add more departments as needed */}
        </select>

        {errors.department && <p className="error">{errors.department}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        

        <button type="submit">Register</button>
      </form>
      {showVerificationDialog && (
        <div className="verification-dialog-centered">
          <div className="verification-dialog-content">
            <h3>Enter Verification Code</h3>
            <input
              type="text"
              placeholder="6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button onClick={handleVerify}>Verify</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;