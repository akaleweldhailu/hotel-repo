import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  return (
    <div style={styles.card}>
      <img 
        src={room.image} 
        alt={room.name}
        style={styles.image}
      />
      <div style={styles.content}>
        <h3 style={styles.title}>{room.name}</h3>
        <p style={styles.description}>{room.description.substring(0, 100)}...</p>
        <div style={styles.details}>
          <span style={styles.price}>${room.price}/night</span>
          <span style={styles.guests}>Max {room.maxGuests} guests</span>
        </div>
        <div style={styles.amenities}>
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} style={styles.amenity}>{amenity}</span>
          ))}
        </div>
        <Link to={`/rooms/${room._id}`} style={styles.bookBtn}>
          View Details
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
    }
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  content: {
    padding: '20px'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '1.3rem',
    color: '#2c3e50'
  },
  description: {
    color: '#666',
    margin: '0 0 15px 0',
    lineHeight: '1.5'
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  price: {
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: '1.2rem'
  },
  guests: {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  amenities: {
    display: 'flex',
    gap: '5px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  amenity: {
    backgroundColor: '#ecf0f1',
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '0.8rem',
    color: '#2c3e50'
  },
  bookBtn: {
    display: 'block',
    backgroundColor: '#3498db',
    color: 'white',
    textAlign: 'center',
    padding: '12px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#2980b9'
    }
  }
};

export default RoomCard;