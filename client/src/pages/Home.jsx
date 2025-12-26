import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRooms } from '../utils/api';
import RoomCard from '../components/RoomCard';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.data.slice(0, 3)); // Show only 3 rooms on home
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to StaySimple</h1>
        <p style={styles.heroSubtitle}>Book your perfect room with ease</p>
        <Link to="/rooms" style={styles.ctaButton}>
          Browse Rooms
        </Link>
      </section>

      {/* Featured Rooms */}
      <section style={styles.featured}>
        <h2 style={styles.sectionTitle}>Featured Rooms</h2>
        
        {loading ? (
          <div className="spinner"></div>
        ) : rooms.length > 0 ? (
          <div style={styles.roomsGrid}>
            {rooms.map(room => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        ) : (
          <p>No rooms available at the moment.</p>
        )}
        
        <div style={styles.viewAll}>
          <Link to="/rooms" style={styles.viewAllBtn}>
            View All Rooms →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Choose Us</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.feature}>
            <h3>Easy Booking</h3>
            <p>Simple and quick booking process</p>
          </div>
          <div style={styles.feature}>
            <h3>Best Prices</h3>
            <p>Competitive rates guaranteed</p>
          </div>
          <div style={styles.feature}>
            <h3>24/7 Support</h3>
            <p>We're always here to help</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  hero: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '10px',
    marginBottom: '50px'
  },
  heroTitle: {
    fontSize: '3rem',
    marginBottom: '20px'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    opacity: 0.9,
    marginBottom: '30px'
  },
  ctaButton: {
    display: 'inline-block',
    backgroundColor: 'white',
    color: '#667eea',
    padding: '12px 30px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: 'transform 0.3s',
    ':hover': {
      transform: 'translateY(-2px)'
    }
  },
  featured: {
    marginBottom: '50px'
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '40px',
    color: '#2c3e50'
  },
  roomsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginBottom: '40px'
  },
  viewAll: {
    textAlign: 'center'
  },
  viewAllBtn: {
    display: 'inline-block',
    backgroundColor: '#3498db',
    color: 'white',
    padding: '10px 30px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#2980b9'
    }
  },
  features: {
    marginBottom: '50px'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px'
  },
  feature: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
    ':hover': {
      transform: 'translateY(-5px)'
    }
  }
};

export default Home;