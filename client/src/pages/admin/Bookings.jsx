import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBookings, updateBookingStatus } from '../../utils/api';
import Alert from '../../components/Alert';

const AdminBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  useEffect(() => {
    filterBookings();
  }, [bookings, statusFilter, searchTerm]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookings();
      setBookings(response.data);
      setFilteredBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setAlert({ type: 'error', message: 'Failed to load bookings' });
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.user?.name?.toLowerCase().includes(term) ||
        booking.user?.email?.toLowerCase().includes(term) ||
        booking.room?.name?.toLowerCase().includes(term) ||
        booking._id.toLowerCase().includes(term)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      
      // Update local state
      setBookings(bookings.map(booking =>
        booking._id === bookingId
          ? { ...booking, status: newStatus }
          : booking
      ));
      
      setAlert({ 
        type: 'success', 
        message: `Booking status updated to ${newStatus}` 
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      setAlert({ type: 'error', message: 'Failed to update booking status' });
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'cancelled': return '#e74c3c';
      case 'completed': return '#3498db';
      default: return '#7f8c8d';
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div className="spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Manage Bookings</h1>
        <div style={styles.headerActions}>
          <button 
            onClick={fetchBookings}
            style={styles.refreshBtn}
          >
            Refresh
          </button>
        </div>
      </div>

      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Filters */}
      <div style={styles.filterSection}>
        <div style={styles.filterRow}>
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="Search by name, email, room, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.statusFilter}>
            <label style={styles.filterLabel}>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        <div style={styles.filterStats}>
          <p>
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <div style={styles.tableContainer}>
        {filteredBookings.length === 0 ? (
          <div style={styles.empty}>
            <p>No bookings found matching your criteria.</p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                style={styles.clearBtn}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div style={styles.bookingsGrid}>
            {filteredBookings.map(booking => (
              <div key={booking._id} style={styles.bookingCard}>
                <div style={styles.bookingHeader}>
                  <div>
                    <h3 style={styles.bookingId}>
                      Booking #{booking._id.slice(-6)}
                    </h3>
                    <p style={styles.bookingDate}>
                      Created: {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                  <div style={styles.statusSection}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(booking.status)
                    }}>
                      {booking.status.toUpperCase()}
                    </span>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      style={styles.statusSelect}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div style={styles.bookingBody}>
                  <div style={styles.bookingRow}>
                    <div style={styles.infoGroup}>
                      <h4 style={styles.infoLabel}>Customer</h4>
                      <p style={styles.infoValue}>{booking.user?.name}</p>
                      <p style={styles.infoSub}>{booking.user?.email}</p>
                    </div>
                    
                    <div style={styles.infoGroup}>
                      <h4 style={styles.infoLabel}>Room</h4>
                      <p style={styles.infoValue}>{booking.room?.name}</p>
                      <p style={styles.infoSub}>
                        ${booking.room?.price}/night
                      </p>
                    </div>
                    
                    <div style={styles.infoGroup}>
                      <h4 style={styles.infoLabel}>Dates</h4>
                      <p style={styles.infoValue}>
                        {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                      </p>
                      <p style={styles.infoSub}>
                        {calculateNights(booking.checkIn, booking.checkOut)} nights
                      </p>
                    </div>
                    
                    <div style={styles.infoGroup}>
                      <h4 style={styles.infoLabel}>Details</h4>
                      <p style={styles.infoValue}>
                        {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                      </p>
                      <p style={styles.infoSub}>
                        Total: <strong style={styles.total}>
                          ${booking.totalPrice}
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div style={styles.bookingActions}>
                  <button
                    onClick={() => navigate(`/rooms/${booking.room?._id}`)}
                    style={styles.viewRoomBtn}
                  >
                    View Room
                  </button>
                  <button
                    onClick={() => navigate(`/admin/bookings/${booking._id}`)}
                    style={styles.detailsBtn}
                  >
                    View Details
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
    minHeight: '300px',
    textAlign: 'center',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    margin: '0',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  refreshBtn: {
    padding: '10px 20px',
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
  filterSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  filterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: '1',
    minWidth: '300px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    ':focus': {
      outline: 'none',
      borderColor: '#3498db',
      boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
    },
  },
  statusFilter: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  filterLabel: {
    fontWeight: '500',
    color: '#34495e',
  },
  filterSelect: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  filterStats: {
    textAlign: 'right',
    fontSize: '0.9rem',
    color: '#7f8c8d',
  },
  tableContainer: {
    minHeight: '300px',
  },
  empty: {
    textAlign: 'center',
    padding: '50px 20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  clearBtn: {
    padding: '8px 20px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '15px',
    ':hover': {
      backgroundColor: '#7f8c8d',
    },
  },
  bookingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
    gap: '20px',
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s',
    ':hover': {
      transform: 'translateY(-5px)',
    },
  },
  bookingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #eee',
  },
  bookingId: {
    margin: '0 0 5px 0',
    fontSize: '1.1rem',
    color: '#2c3e50',
  },
  bookingDate: {
    margin: '0',
    fontSize: '0.85rem',
    color: '#7f8c8d',
  },
  statusSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  statusSelect: {
    padding: '5px 10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '12px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  bookingBody: {
    padding: '20px',
  },
  bookingRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '20px',
  },
  infoGroup: {
    marginBottom: '0',
  },
  infoLabel: {
    margin: '0 0 8px 0',
    fontSize: '0.9rem',
    color: '#7f8c8d',
    fontWeight: '500',
  },
  infoValue: {
    margin: '0 0 4px 0',
    fontSize: '1rem',
    color: '#2c3e50',
    fontWeight: '500',
  },
  infoSub: {
    margin: '0',
    fontSize: '0.85rem',
    color: '#95a5a6',
  },
  total: {
    color: '#27ae60',
    fontSize: '1.1rem',
  },
  bookingActions: {
    display: 'flex',
    padding: '15px 20px',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #eee',
    gap: '10px',
  },
  viewRoomBtn: {
    padding: '8px 16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#2980b9',
    },
  },
  detailsBtn: {
    padding: '8px 16px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#7f8c8d',
    },
  },
};

export default AdminBookings;