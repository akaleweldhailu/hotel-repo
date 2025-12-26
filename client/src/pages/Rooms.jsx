import React, { useState, useEffect } from 'react';
import RoomCard from '../components/RoomCard';
import { getRooms } from '../utils/api';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 500,
    guests: 1,
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, filters]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await getRooms();
      setRooms(response.data);
      setFilteredRooms(response.data);
    } catch (error) {
      setError('Failed to load rooms. Please try again.');
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRooms = () => {
    let filtered = [...rooms];

    // Filter by price
    filtered = filtered.filter(room => 
      room.price >= filters.minPrice && room.price <= filters.maxPrice
    );

    // Filter by guests
    filtered = filtered.filter(room => 
      room.maxGuests >= filters.guests
    );

    setFilteredRooms(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div className="spinner"></div>
        <p>Loading rooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <div className="alert alert-error">{error}</div>
        <button onClick={fetchRooms} style={styles.retryBtn}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Available Rooms</h1>
      <p style={styles.subtitle}>Find your perfect stay</p>

      {/* Filters */}
      <div style={styles.filterSection}>
        <div style={styles.filterCard}>
          <h3 style={styles.filterTitle}>Filter Rooms</h3>
          
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Price Range: ${filters.minPrice} - ${filters.maxPrice}</label>
            <div style={styles.rangeInputs}>
              <input
                type="range"
                name="minPrice"
                min="0"
                max="500"
                step="10"
                value={filters.minPrice}
                onChange={handleFilterChange}
                style={styles.rangeInput}
              />
              <input
                type="range"
                name="maxPrice"
                min="50"
                max="1000"
                step="10"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                style={styles.rangeInput}
              />
            </div>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Number of Guests</label>
            <select
              name="guests"
              value={filters.guests}
              onChange={handleFilterChange}
              style={styles.select}
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4+ Guests</option>
            </select>
          </div>

          <div style={styles.filterStats}>
            <p>{filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found</p>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length > 0 ? (
        <div style={styles.roomsGrid}>
          {filteredRooms.map(room => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      ) : (
        <div style={styles.center}>
          <p style={styles.noRooms}>No rooms found matching your criteria.</p>
          <button 
            onClick={() => setFilters({ minPrice: 0, maxPrice: 500, guests: 1 })}
            style={styles.resetBtn}
          >
            Reset Filters
          </button>
        </div>
      )}
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
  title: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    color: '#2c3e50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: '40px',
  },
  filterSection: {
    marginBottom: '40px',
  },
  filterCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  filterTitle: {
    marginBottom: '20px',
    color: '#2c3e50',
  },
  filterGroup: {
    marginBottom: '25px',
  },
  filterLabel: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '500',
    color: '#34495e',
  },
  rangeInputs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  rangeInput: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    background: '#ddd',
    outline: 'none',
    opacity: '0.7',
    transition: 'opacity 0.2s',
    ':hover': {
      opacity: '1',
    },
  },
  select: {
    width: '100%',
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  filterStats: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#ecf0f1',
    borderRadius: '5px',
    textAlign: 'center',
    fontWeight: '500',
  },
  roomsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '30px',
  },
  noRooms: {
    fontSize: '1.2rem',
    color: '#7f8c8d',
    marginBottom: '20px',
  },
  retryBtn: {
    padding: '10px 25px',
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
  resetBtn: {
    padding: '10px 25px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#7f8c8d',
    },
  },
};

export default Rooms;