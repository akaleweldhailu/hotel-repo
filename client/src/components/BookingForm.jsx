import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Alert from './Alert';
import { createBooking } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const BookingForm = ({ room, user }) => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return days * room.price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setAlert({ type: 'error', message: 'Please login to make a booking' });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    
    if (!checkIn || !checkOut) {
      setAlert({ type: 'error', message: 'Please select check-in and check-out dates' });
      return;
    }
    
    if (guests > room.maxGuests) {
      setAlert({ type: 'error', message: `Maximum guests allowed: ${room.maxGuests}` });
      return;
    }

    if (checkIn >= checkOut) {
      setAlert({ type: 'error', message: 'Check-out date must be after check-in date' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const bookingData = {
        roomId: room._id,
        checkIn,
        checkOut,
        guests
      };
      
      await createBooking(bookingData);
      
      setAlert({ 
        type: 'success', 
        message: 'Booking confirmed successfully!' 
      });
      
      // Clear form
      setCheckIn(null);
      setCheckOut(null);
      setGuests(1);
      
      // Redirect to profile after delay
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (error) {
      console.error('Booking error:', error);
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Booking failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Book This Room</h3>
      
      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Check-in Date</label>
          <DatePicker
            selected={checkIn}
            onChange={date => setCheckIn(date)}
            minDate={new Date()}
            dateFormat="MM/dd/yyyy"
            placeholderText="Select check-in date"
            style={styles.datePicker}
            wrapperClassName="date-picker"
            disabled={loading}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Check-out Date</label>
          <DatePicker
            selected={checkOut}
            onChange={date => setCheckOut(date)}
            minDate={checkIn || new Date()}
            dateFormat="MM/dd/yyyy"
            placeholderText="Select check-out date"
            style={styles.datePicker}
            wrapperClassName="date-picker"
            disabled={loading}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Number of Guests</label>
          <select
            value={guests}
            onChange={e => setGuests(parseInt(e.target.value))}
            style={styles.select}
            disabled={loading}
          >
            {[...Array(room.maxGuests)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>
        
        {/* Booking Summary */}
        <div style={styles.summary}>
          <h4 style={styles.summaryTitle}>Booking Summary</h4>
          <div style={styles.summaryRow}>
            <span>Room:</span>
            <span>{room.name}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Price per night:</span>
            <span>${room.price}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Nights:</span>
            <span>
              {checkIn && checkOut 
                ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
                : 0}
            </span>
          </div>
          <div style={styles.summaryRow}>
            <span>Guests:</span>
            <span>{guests}</span>
          </div>
          <div style={styles.summaryTotal}>
            <span>Total:</span>
            <span style={styles.totalPrice}>${calculateTotal()}</span>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !user}
          style={styles.submitBtn}
        >
          {!user ? 'Login to Book' : loading ? 'Booking...' : 'Confirm Booking'}
        </button>
        
        {!user && (
          <p style={styles.loginPrompt}>
            You need to be logged in to make a booking.
          </p>
        )}
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  title: {
    marginBottom: '20px',
    color: '#2c3e50',
    fontSize: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: '500',
    color: '#34495e',
  },
  datePicker: {
    width: '100%',
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  select: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  summary: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '5px',
    border: '1px solid #e9ecef',
  },
  summaryTitle: {
    marginBottom: '15px',
    color: '#2c3e50',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    paddingBottom: '10px',
    borderBottom: '1px dashed #dee2e6',
    ':last-child': {
      borderBottom: 'none',
    },
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '2px solid #dee2e6',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  totalPrice: {
    color: '#27ae60',
    fontSize: '1.2rem',
  },
  submitBtn: {
    padding: '14px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover:not(:disabled)': {
      backgroundColor: '#219653',
    },
    ':disabled': {
      backgroundColor: '#95a5a6',
      cursor: 'not-allowed',
    },
  },
  loginPrompt: {
    textAlign: 'center',
    color: '#e74c3c',
    fontSize: '0.9rem',
    marginTop: '10px',
  },
};

export default BookingForm;