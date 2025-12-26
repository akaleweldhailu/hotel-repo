import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { login } from '../utils/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setAlert({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const response = await login({ email, password });
      
      // Save token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      }));
      
      // Update parent component state
      onLogin({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      });
      
      setAlert({ type: 'success', message: 'Login successful!' });
      
      // Redirect after delay
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      console.error('Login error:', error);
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>
        <p style={styles.subtitle}>Welcome back! Please login to your account.</p>
        
        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
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
              placeholder="Enter your password"
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div style={styles.links}>
          <p>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>
              Register here
            </Link>
          </p>
          <p style={styles.demo}>
            <strong>Demo Credentials:</strong><br />
            Admin: admin@example.com / admin123<br />
            User: john@example.com / user123
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
    maxWidth: '400px',
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
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
    ':hover:not(:disabled)': {
      backgroundColor: '#2980b9',
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
  demo: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    fontSize: '0.85rem',
    lineHeight: '1.5',
  },
};

export default Login;