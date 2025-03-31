import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import email_icon from "./assets/email_icon.png";
import password_icon from "./assets/password_icon.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Connecting to backend mapping
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
        }
      );
      if (response.data === "Login successful!") {
        // There should be a home page we can redirect to, but just go back to main
        navigate("/");
      } else {
        setError("Invalid email or password!");
      }
    } catch (err) {
      setError("An error occurred during login.");
      console.error(err);
    }
  };

  return (
    // Form to login
    <div className="box-container">
      <h1 className="title-text-style">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="input">
          <img src={email_icon} />
          <label> Email </label>
          <input
            type="email"
            className="textbox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <img src={password_icon} />
          <label> Password </label>
          <input
            type="password"
            className="textbox"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <div>
        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
