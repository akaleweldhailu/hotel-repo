import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRooms, deleteRoom } from '../../utils/api';
import Alert from '../../components/Alert';

const AdminRooms = ({ user }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchRooms();
  }, [user, navigate]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setAlert({ type: 'error', message: 'Failed to load rooms' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      await deleteRoom(id);
      setRooms(rooms.filter(room => room._id !== id));
      setAlert({ type: 'success', message: 'Room deleted successfully' });
    } catch (error) {
      console.error('Error deleting room:', error);
      setAlert({ type: 'error', message: 'Failed to delete room' });
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/rooms/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate('/admin/rooms/new');
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div className="spinner"></div>
        <p>Loading rooms...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Manage Rooms</h1>
        <button onClick={handleAddNew} style={styles.addBtn}>
          + Add New Room
        </button>
      </div>

      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div style={styles.tableContainer}>
        {rooms.length === 0 ? (
          <div style={styles.empty}>
            <p>No rooms found. Add your first room!</p>
            <button onClick={handleAddNew} style={styles.addBtn}>
              Add New Room
            </button>
          </div>
        ) : (
          <div style={styles.roomsGrid}>
            {rooms.map(room => (
              <div key={room._id} style={styles.roomCard}>
                <img 
                  src={room.image} 
                  alt={room.name}
                  style={styles.roomImage}
                />
                <div style={styles.roomContent}>
                  <div style={styles.roomHeader}>
                    <h3 style={styles.roomName}>{room.name}</h3>
                    <span style={{
                      ...styles.status,
                      ...(room.isAvailable ? styles.available : styles.unavailable)
                    }}>
                      {room.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  
                  <p style={styles.roomDescription}>
                    {room.description.substring(0, 100)}...
                  </p>
                  
                  <div style={styles.roomDetails}>
                    <div style={styles.detail}>
                      <span style={styles.detailLabel}>Price:</span>
                      <span style={styles.detailValue}>${room.price}/night</span>
                    </div>
                    <div style={styles.detail}>
                      <span style={styles.detailLabel}>Max Guests:</span>
                      <span style={styles.detailValue}>{room.maxGuests}</span>
                    </div>
                    <div style={styles.detail}>
                      <span style={styles.detailLabel}>Amenities:</span>
                      <span style={styles.detailValue}>
                        {room.amenities.slice(0, 2).join(', ')}
                        {room.amenities.length > 2 && '...'}
                      </span>
                    </div>
                  </div>
                  
                  <div style={styles.roomActions}>
                    <button 
                      onClick={() => handleEdit(room._id)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => navigate(`/rooms/${room._id}`)}
                      style={styles.viewBtn}
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleDelete(room._id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
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
  addBtn: {
    padding: '10px 25px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#219653',
    },
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    padding: '20px',
  },
  empty: {
    textAlign: 'center',
    padding: '50px 20px',
  },
  roomsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px',
  },
  roomCard: {
    border: '1px solid #eee',
    borderRadius: '10px',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    },
  },
  roomImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  roomContent: {
    padding: '20px',
  },
  roomHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  roomName: {
    margin: '0',
    fontSize: '1.2rem',
    color: '#2c3e50',
    flex: '1',
  },
  status: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    marginLeft: '10px',
  },
  available: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    color: '#27ae60',
  },
  unavailable: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    color: '#e74c3c',
  },
  roomDescription: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  roomDetails: {
    marginBottom: '20px',
  },
  detail: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '0.9rem',
  },
  detailLabel: {
    color: '#7f8c8d',
    fontWeight: '500',
  },
  detailValue: {
    color: '#34495e',
  },
  roomActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  editBtn: {
    flex: '1',
    padding: '8px',
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
  viewBtn: {
    flex: '1',
    padding: '8px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#7f8c8d',
    },
  },
  deleteBtn: {
    flex: '1',
    padding: '8px',
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
};

export default AdminRooms;