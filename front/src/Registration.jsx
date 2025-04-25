import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import email_icon from "./assets/email_icon.png";
import password_icon from "./assets/password_icon.png";
import person_icon from "./assets/person_icon.png";

const Registration = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
     try {
      const response = await axios.post('/api/auth/register', {
          firstName, lastName, email, password, role: 'USER', // Gonna hardcode role as USER
      });
      console.log('Registration successful:', response.data);
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
       if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='box-container'>
      <h1 className='title-text-style'>Register</h1>
      <form onSubmit={handleSubmit}>

        <div className='input-group'>
           <div className='input-label-line'>
            <img src={person_icon} alt="Name icon"/>
            <label htmlFor="firstName"> First Name *</label>
           </div>
          <input
            type="text"
            id="firstName"
            className='textbox'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            aria-required="true"
          />
        </div>

          <div className='input-group'>
              <div className='input-label-line'>
                  <img src={person_icon} alt="Name icon"/>
                  <label htmlFor="lastName"> Last Name *</label>
              </div>
              <input
                  type="text"
                  id="lastName"
                  className='textbox'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  aria-required="true"
              />
          </div>

        <div className='input-group'>
          <div className='input-label-line'>
            <img src={email_icon} alt="Email icon"/>
            <label htmlFor="email"> Email *</label>
          </div>
          <input
            type="email"
            id="email"
            className='textbox'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
          />
        </div>

        <div className='input-group'>
           <div className='input-label-line'>
            <img src={password_icon} alt="Password icon"/>
            <label htmlFor="password"> Password *</label>
           </div>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className='textbox'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
          />
        </div>

        <div className="show-password-option" style={{ justifyContent: 'flex-end', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
             <input
               type="checkbox"
               id="showPasswordCheckbox"
               checked={showPassword}
               onChange={togglePasswordVisibility}
             />
             <label htmlFor="showPasswordCheckbox">Show Password</label>
        </div>

        <button type="submit" className="button-primary">Register</button>

        {error && <p className="form-error">{error}</p>}
      </form>

      <div style={{ marginTop: "1.5em", textAlign: 'center' }}>
        <p>
          Already have an account?{' '}
          <Link to="/login" className="form-link">Login here</Link>
        </p>
      </div>

    </div>
  );
};

export default Registration;