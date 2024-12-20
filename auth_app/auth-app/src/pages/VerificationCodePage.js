// src/pages/VerificationCodePage.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/VerificationCodePage.css';

const VerificationCodePage = ({ email }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');

  const handleCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/verify-code/', { email, code: verificationCode });
      alert(response.data.message);
      if (response.data.success) {
        window.location.href = `/department/${response.data.department}`;
      }
    } catch (error) {
      alert('Invalid verification code');
    }
  };

  const handleResendCode = async () => {
    try {
      await axios.post('http://localhost:8000/api/resend-verification-code/', { email });
      setMessage('Verification code resent to your email.');
    } catch (error) {
      alert('Error resending code');
    }
  };

  return (
    <div className="verification-code-container">
      <h3>Enter Verification Code</h3>
      <input type="text" placeholder="6-digit code" value={verificationCode} onChange={handleCodeChange} />
      <button onClick={handleVerify}>Verify</button>
      <button onClick={handleResendCode}>Resend Code</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default VerificationCodePage;
