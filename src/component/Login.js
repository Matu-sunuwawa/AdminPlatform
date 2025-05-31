

import Container from 'react-bootstrap/Container';
import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext';

import '../style/css/LoginForm.css';

function Login() {

  const { submitLogin, error } = useContext(AuthContext)

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="signin-container">
        <div className="signin-card">
            <h1 className="signin-title">Sign In</h1>
            <p className="signin-subtitle">Access your Mela Admin Dashboard</p>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={submitLogin} className="signin-form">
                <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input type="number" placeholder="e.g. 9xxxxxxxx" requiredaria-label="Phone number" name='phone_number' className="form-input" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="password-wrapper">
                    <input type={showPassword ? "text" : "password"} placeholder="Enter your password" aria-label="Password" name='password' className="form-input" required />
                    <span
                        onClick={() => setShowPassword(!showPassword)} className="toggle-password" role="button" tabIndex="0"
                        onKeyPress={(e) => e.key === "Enter" && setShowPassword(!showPassword)}
                    >
                        <svg
                            className="toggle-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            {showPassword ? (
                                <>
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </>
                            ) : (
                                <>
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </>
                            )}
                        </svg>
                    </span>
                    </div>
                </div>
                <button type="submit" className="signin-button" >Sign In</button>
            </form>
        </div>
    </div>
  )
}

export default Login