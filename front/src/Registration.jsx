import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const [firstName, setFirstName] = useState(''); // First name state
  const [lastName, setLastName] = useState('');   // Last name state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Role will be "elderly", "caregiver", or "provider"
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending the registration data to the backend with the selected role
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
        role: role || 'elderly', // default to "elderly" if no role is selected
      });
      console.log(response.data);
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* Role selection buttons */}
        <div style={{ margin: '1em 0' }}>
          <p>Sign Up As:</p>
          <button
            type="button"
            onClick={() => setRole('elderly')}
            style={{ backgroundColor: role === 'elderly' ? '#ccc' : '' }}
          >
            Elderly
          </button>
          <button
            type="button"
            onClick={() => setRole('caregiver')}
            style={{ margin: '0 0.5em', backgroundColor: role === 'caregiver' ? '#ccc' : '' }}
          >
            Caregiver/Family
          </button>
          <button
            type="button"
            onClick={() => setRole('provider')}
            style={{ backgroundColor: role === 'provider' ? '#ccc' : '' }}
          >
            Resource Provider
          </button>
        </div>
        <button type="submit">Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Registration;
