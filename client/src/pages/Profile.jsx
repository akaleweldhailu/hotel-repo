import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { getMyBookings, cancelBooking } from '../utils/api';

const Profile = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setAlert({ 
        type: 'error', 
        message: 'Failed to load your bookings.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await cancelBooking(bookingId);
      
      // Update bookings list
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      
      setAlert({ 
        type: 'success', 
        message: 'Booking cancelled successfully!' 
      });
      
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to cancel booking.' 
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  if (!user) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Profile</h1>
      
      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      
      {/* User Info */}
      <div style={styles.userCard}>
        <div style={styles.userHeader}>
          <div style={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={styles.userName}>{user.name}</h2>
            <p style={styles.userEmail}>{user.email}</p>
            <p style={styles.userRole}>
              Role: <span style={styles.roleBadge}>{user.role}</span>
            </p>
          </div>
        </div>
        <div style={styles.userStats}>
          <div style={styles.stat}>
            <span style={styles.statNumber}>{bookings.length}</span>
            <span style={styles.statLabel}>Total Bookings</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNumber}>
              {bookings.filter(b => b.status === 'confirmed').length}
            </span>
            <span style={styles.statLabel}>Active Bookings</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNumber}>
              {bookings.filter(b => b.status === 'cancelled').length}
            </span>
            <span style={styles.statLabel}>Cancelled</span>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div style={styles.bookingsSection}>
        <h2 style={styles.sectionTitle}>My Bookings</h2>
        
        {loading ? (
          <div style={styles.center}>
            <div className="spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={styles.noBookings}>
            <p>You haven't made any bookings yet.</p>
            <button 
              onClick={() => navigate('/rooms')}
              style={styles.browseBtn}
            >
              Browse Rooms
            </button>
          </div>
        ) : (
          <div style={styles.bookingsGrid}>
            {bookings.map(booking => (
              <div key={booking._id} style={styles.bookingCard}>
                <div style={styles.bookingHeader}>
                  <h3 style={styles.bookingTitle}>
                    {booking.room?.name || 'Room'}
                  </h3>
                  <span style={{
                    ...styles.status,
                    ...(booking.status === 'confirmed' 
                      ? styles.statusConfirmed 
                      : styles.statusCancelled)
                  }}>
                    {booking.status}
                  </span>
                </div>
                
                <div style={styles.bookingDetails}>
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Check-in:</span>
                    <span style={styles.detailValue}>
                      {formatDate(booking.checkIn)}
                    </span>
                  </div>
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Check-out:</span>
                    <span style={styles.detailValue}>
                      {formatDate(booking.checkOut)}
                    </span>
                  </div>
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Nights:</span>
                    <span style={styles.detailValue}>
                      {calculateNights(booking.checkIn, booking.checkOut)}
                    </span>
                  </div>
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Guests:</span>
                    <span style={styles.detailValue}>{booking.guests}</span>
                  </div>
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Total:</span>
                    <span style={styles.detailPrice}>${booking.totalPrice}</span>
                  </div>
                </div>
                
                <div style={styles.bookingActions}>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      style={styles.cancelBtn}
                    >
                      Cancel Booking
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/rooms/${booking.room?._id}`)}
                    style={styles.viewBtn}
                  >
                    View Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '30px',
    color: '#2c3e50',
  },
  userCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    marginBottom: '40px',
  },
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: '1.8rem',
    marginBottom: '5px',
    color: '#2c3e50',
  },
  userEmail: {
    color: '#7f8c8d',
    marginBottom: '10px',
  },
  userRole: {
    color: '#34495e',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#ecf0f1',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  userStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  stat: {
    textAlign: 'center',
  },
  statNumber: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: '5px',
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  bookingsSection: {
    marginTop: '20px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    marginBottom: '25px',
    color: '#2c3e50',
  },
  noBookings: {
    textAlign: 'center',
    padding: '50px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
  },
  browseBtn: {
    padding: '12px 30px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '20px',
    ':hover': {
      backgroundColor: '#2980b9',
    },
  },
  bookingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px',
  },
  bookingCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
    ':hover': {
      transform: 'translateY(-5px)',
    },
  },
  bookingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  bookingTitle: {
    fontSize: '1.3rem',
    color: '#2c3e50',
    margin: '0',
  },
  status: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  statusConfirmed: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    color: '#27ae60',
  },
  statusCancelled: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    color: '#e74c3c',
  },
  bookingDetails: {
    marginBottom: '25px',
  },
  detail: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f0f0f0',
    ':last-child': {
      borderBottom: 'none',
    },
  },
  detailLabel: {
    color: '#7f8c8d',
    fontSize: '0.95rem',
  },
  detailValue: {
    fontWeight: '500',
    color: '#34495e',
  },
  detailPrice: {
    fontWeight: 'bold',
    color: '#27ae60',
    fontSize: '1.1rem',
  },
  bookingActions: {
    display: 'flex',
    gap: '10px',
  },
  cancelBtn: {
    flex: '1',
    padding: '10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#c0392b',
    },
  },
  viewBtn: {
    flex: '1',
    padding: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#2980b9',
    },
  },
};

export default Profile;