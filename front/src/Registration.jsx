import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import email_icon from "./assets/email_icon.png";
import password_icon from "./assets/password_icon.png";
import person_icon from "./assets/person_icon.png";


const Registration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending the registration data to the backend
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        name,
        email,
        password,
        role: 'USER', // Gonna hardcode role as USER
      });
      console.log(response.data);
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className='box-container'>
      <h1 className='title-text-style'>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className='input'>
          <img src={person_icon} />
          <label> Name</label>
          <input 
            type="text" 
            className='textbox'
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
          />
        </div>
        <div className='input'>
          <img src={email_icon} />
          <label> Email</label>
          <input 
            className='textbox'
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        <div className='input'>
          <img src={password_icon} />
          <label> Password</label>
          <input 
            className='textbox'
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>
        <button type="submit">Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Registration;
