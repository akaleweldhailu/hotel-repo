import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { register } from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setAlert({ type: 'error', message: 'Please fill in all fields' });
      return;
    }
    
    if (password !== confirmPassword) {
      setAlert({ type: 'error', message: 'Passwords do not match' });
      return;
    }
    
    if (password.length < 6) {
      setAlert({ type: 'error', message: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const response = await register({ name, email, password });
      
      setAlert({ 
        type: 'success', 
        message: 'Registration successful! You can now login.' 
      });
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Redirect to login after delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join our hotel booking platform</p>
        
        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={styles.input}
              disabled={loading}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={styles.input}
              disabled={loading}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter password (min 6 characters)"
              style={styles.input}
              disabled={loading}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              style={styles.input}
              disabled={loading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div style={styles.links}>
          <p>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 200px)',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '10px',
    color: '#2c3e50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: '30px',
  },
  form: {
    marginBottom: '30px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#34495e',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    ':focus': {
      outline: 'none',
      borderColor: '#3498db',
      boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
    },
    ':disabled': {
      backgroundColor: '#f5f5f5',
      cursor: 'not-allowed',
    },
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
    ':hover:not(:disabled)': {
      backgroundColor: '#219653',
    },
    ':disabled': {
      backgroundColor: '#95a5a6',
      cursor: 'not-allowed',
    },
  },
  links: {
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#7f8c8d',
  },
  link: {
    color: '#3498db',
    fontWeight: '500',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
};

export default Register;