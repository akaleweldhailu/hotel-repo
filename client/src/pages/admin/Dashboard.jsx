import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import { getAdminStats } from '../../utils/api';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getAdminStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setAlert({ type: 'error', message: 'Failed to load dashboard data' });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <div style={styles.headerActions}>
          <button 
            onClick={() => navigate('/admin/rooms')}
            style={styles.actionBtn}
          >
            Manage Rooms
          </button>
          <button 
            onClick={() => navigate('/admin/bookings')}
            style={styles.actionBtn}
          >
            Manage Bookings
          </button>
          <button 
            onClick={() => navigate('/rooms')}
            style={styles.actionBtn}
          >
            View as Customer
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

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, backgroundColor: 'rgba(52, 152, 219, 0.1)', color: '#3498db'}}>👥</div>
          <div>
            <h3 style={styles.statNumber}>{stats?.totalUsers || 0}</h3>
            <p style={styles.statLabel}>Total Users</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statIcon, backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71'}}>🏨</div>
          <div>
            <h3 style={styles.statNumber}>{stats?.totalRooms || 0}</h3>
            <p style={styles.statLabel}>Available Rooms</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statIcon, backgroundColor: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6'}}>📅</div>
          <div>
            <h3 style={styles.statNumber}>{stats?.totalBookings || 0}</h3>
            <p style={styles.statLabel}>Total Bookings</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statIcon, backgroundColor: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f'}}>💰</div>
          <div>
            <h3 style={styles.statNumber}>{formatCurrency(stats?.totalRevenue || 0)}</h3>
            <p style={styles.statLabel}>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={styles.quickStats}>
        <div style={styles.quickStatCard}>
          <h3>Average Booking Value</h3>
          <p style={styles.quickStatValue}>
            {formatCurrency(stats?.averageBooking || 0)}
          </p>
        </div>
        <div style={styles.quickStatCard}>
          <h3>Monthly Bookings</h3>
          <p style={styles.quickStatValue}>
            {stats?.monthlyBookings?.[0]?.count || 0}
          </p>
        </div>
        <div style={styles.quickStatCard}>
          <h3>Most Booked Room</h3>
          <p style={styles.quickStatValue}>
            {stats?.roomOccupancy?.[0]?.roomDetails?.[0]?.name || 'N/A'}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={styles.recentActivity}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          <button 
            onClick={() => navigate('/admin/rooms/new')}
            style={styles.quickActionBtn}
          >
            <span style={styles.actionIcon}>➕</span>
            <span style={styles.actionText}>Add New Room</span>
          </button>
          <button 
            onClick={() => navigate('/admin/bookings')}
            style={styles.quickActionBtn}
          >
            <span style={styles.actionIcon}>📋</span>
            <span style={styles.actionText}>View All Bookings</span>
          </button>
          <button 
            onClick={fetchStats}
            style={styles.quickActionBtn}
          >
            <span style={styles.actionIcon}>🔄</span>
            <span style={styles.actionText}>Refresh Data</span>
          </button>
          <button 
            onClick={() => navigate('/rooms')}
            style={styles.quickActionBtn}
          >
            <span style={styles.actionIcon}>👀</span>
            <span style={styles.actionText}>View as Customer</span>
          </button>
        </div>
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
    minHeight: '400px',
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
    fontSize: '2.5rem',
    color: '#2c3e50',
    margin: '0',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  actionBtn: {
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    transition: 'transform 0.3s',
    ':hover': {
      transform: 'translateY(-5px)',
    },
  },
  statIcon: {
    fontSize: '2.5rem',
    width: '70px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  statNumber: {
    fontSize: '2rem',
    margin: '0 0 5px 0',
    color: '#2c3e50',
  },
  statLabel: {
    color: '#7f8c8d',
    margin: '0',
    fontSize: '0.9rem',
  },
  quickStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  quickStatCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  quickStatValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: '10px',
  },
  recentActivity: {
    marginTop: '30px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  quickActionBtn: {
    backgroundColor: 'white',
    border: '2px solid #3498db',
    padding: '25px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    ':hover': {
      backgroundColor: '#3498db',
      color: 'white',
    },
  },
  actionIcon: {
    fontSize: '2rem',
  },
  actionText: {
    fontSize: '1rem',
    fontWeight: '500',
  },
};

export default Dashboard;