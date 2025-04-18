import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import email_icon from "./assets/email_icon.png";
import password_icon from "./assets/password_icon.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors on new submit
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password, },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data) {
        // Consider storing token or user info if backend sends it
        navigate("/home"); // Navigate to a dashboard/home page after login
      } else {
        setError(response.data?.message || "Invalid email or password!");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again later.");
      }
      console.error("Login error:", err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="box-container">
      <h1 className="title-text-style">Login</h1>
      <form onSubmit={handleSubmit}>

        <div className="input-group">
          <div className="input-label-line">
            <img src={email_icon} alt="Email icon"/>
            <label htmlFor="email"> Email Address *</label>
          </div>
          <input
            type="email"
            id="email"
            className="textbox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true" // For accessibility
          />
        </div>

        <div className="input-group">
          <div className="input-label-line">
            <img src={password_icon} alt="Password icon"/>
            <label htmlFor="password"> Password *</label>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="textbox"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true" // For accessibility
          />
        </div>

        <div className="password-options">
           <Link to="/forgot-password" className="form-link forgot-password-link">Forgot Password?</Link>
           <div className="show-password-option">
             <input
               type="checkbox"
               id="showPasswordCheckbox"
               checked={showPassword}
               onChange={togglePasswordVisibility}
             />
             <label htmlFor="showPasswordCheckbox">Show Password</label>
           </div>
        </div>

        <button type="submit" className="button-primary">Login</button>

        {error && <p className="form-error">{error}</p>}
      </form>

      <div style={{ marginTop: "1.5em", textAlign: 'center' }}>
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="form-link">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;