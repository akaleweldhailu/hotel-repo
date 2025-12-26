import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoom } from '../utils/api';
import BookingForm from '../components/BookingForm';
import Alert from '../components/Alert';

const RoomDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  
  // Sample images if room has only one
  const sampleImages = [
    'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop',
  ];

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const response = await getRoom(id);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room:', error);
      setError('Room not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div className="spinner"></div>
        <p>Loading room details...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div style={styles.center}>
        <div className="alert alert-error">{error || 'Room not found'}</div>
        <button onClick={handleBack} style={styles.backBtn}>
          Go Back
        </button>
      </div>
    );
  }

  const images = room.images || [room.image, ...sampleImages.slice(0, 2)];

  return (
    <div style={styles.container}>
      {/* Back button */}
      <button onClick={handleBack} style={styles.backBtn}>
        ← Back to Rooms
      </button>

      <div style={styles.content}>
        {/* Room Images */}
        <div style={styles.imageSection}>
          <div style={styles.mainImage}>
            <img 
              src={images[activeImage]} 
              alt={room.name}
              style={styles.image}
            />
          </div>
          <div style={styles.thumbnailContainer}>
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                style={{
                  ...styles.thumbnail,
                  border: activeImage === index ? '3px solid #3498db' : '3px solid transparent'
                }}
              >
                <img 
                  src={img} 
                  alt={`${room.name} ${index + 1}`}
                  style={styles.thumbnailImage}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Room Details */}
        <div style={styles.detailsSection}>
          <h1 style={styles.title}>{room.name}</h1>
          <p style={styles.price}>${room.price} <span style={styles.perNight}>/ night</span></p>
          
          <div style={styles.rating}>
            <span style={styles.stars}>★★★★★</span>
            <span style={styles.reviews}>(25 reviews)</span>
          </div>

          <p style={styles.description}>{room.description}</p>

          <div style={styles.features}>
            <h3 style={styles.featuresTitle}>Room Features</h3>
            <div style={styles.featuresGrid}>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>👤</span>
                <span>Max Guests: {room.maxGuests}</span>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🛏️</span>
                <span>King Size Bed</span>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>📺</span>
                <span>Smart TV</span>
              </div>
              {room.isAvailable ? (
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>✅</span>
                  <span>Available</span>
                </div>
              ) : (
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>❌</span>
                  <span>Not Available</span>
                </div>
              )}
            </div>
          </div>

          <div style={styles.amenities}>
            <h3 style={styles.amenitiesTitle}>Amenities</h3>
            <div style={styles.amenitiesGrid}>
              {room.amenities && room.amenities.length > 0 ? (
                room.amenities.map((amenity, index) => (
                  <div key={index} style={styles.amenity}>
                    <span style={styles.amenityIcon}>✓</span>
                    {amenity}
                  </div>
                ))
              ) : (
                <>
                  <div style={styles.amenity}>✓ Free WiFi</div>
                  <div style={styles.amenity}>✓ Air Conditioning</div>
                  <div style={styles.amenity}>✓ TV</div>
                  <div style={styles.amenity}>✓ Mini Bar</div>
                  <div style={styles.amenity}>✓ Safe</div>
                  <div style={styles.amenity}>✓ Room Service</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div style={styles.bookingSection}>
          <BookingForm room={room} user={user} />
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
  backBtn: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#3498db',
    border: '1px solid #3498db',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginBottom: '30px',
    ':hover': {
      backgroundColor: '#3498db',
      color: 'white',
    },
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '40px',
  },
  imageSection: {
    marginBottom: '20px',
  },
  mainImage: {
    width: '100%',
    height: '400px',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  thumbnailContainer: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    padding: '10px 0',
  },
  thumbnail: {
    flex: '0 0 100px',
    height: '75px',
    borderRadius: '5px',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: '3px solid transparent',
    padding: '0',
    transition: 'border-color 0.3s',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  detailsSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  price: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: '15px',
  },
  perNight: {
    fontSize: '1rem',
    color: '#7f8c8d',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '25px',
  },
  stars: {
    color: '#f39c12',
    fontSize: '1.2rem',
  },
  reviews: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  description: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#34495e',
    marginBottom: '30px',
  },
  features: {
    marginBottom: '30px',
  },
  featuresTitle: {
    fontSize: '1.3rem',
    marginBottom: '15px',
    color: '#2c3e50',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
  },
  featureIcon: {
    fontSize: '1.2rem',
  },
  amenities: {
    marginBottom: '30px',
  },
  amenitiesTitle: {
    fontSize: '1.3rem',
    marginBottom: '15px',
    color: '#2c3e50',
  },
  amenitiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '10px',
  },
  amenity: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    backgroundColor: '#ecf0f1',
    borderRadius: '5px',
    fontSize: '0.95rem',
  },
  amenityIcon: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  bookingSection: {
    order: 3,
  },
};

export default RoomDetail;