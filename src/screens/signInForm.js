import React, { useState } from "react";
import "./signInForm.css";
import { useNavigate } from "react-router-dom";

export default function SignInForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("https://potion.dev.gumisofts.com/platform_admin/admin_platform_login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful", data);
        localStorage.setItem("access_token", data.access);
        if (keepLoggedIn) {
          localStorage.setItem("keep_logged_in", "true");
        }
        navigate("/");
      } else {
        setError(data?.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1 className="signin-title">Sign In</h1>
        <p className="signin-subtitle">Access your Mela Admin Dashboard</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              placeholder="e.g. +251xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              aria-label="Phone number"
              className="form-input"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
                className="form-input"
                disabled={isLoading}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
                role="button"
                tabIndex="0"
                onKeyPress={(e) => e.key === "Enter" && setShowPassword(!showPassword)}
              >
                <svg
                  className="toggle-icon"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="keepLoggedIn"
              checked={keepLoggedIn}
              onChange={() => setKeepLoggedIn(!keepLoggedIn)}
              className="form-checkbox"
              disabled={isLoading}
            />
            <label htmlFor="keepLoggedIn" className="checkbox-label">Keep me logged in</label>
          </div>
          <button type="submit" className="signin-button" disabled={isLoading}>
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <p className="signup-link">
          Don’t have an account? <a href="/signup" className="signup-link-text">Sign Up</a>
        </p>
      </div>
    </div>
  );
}