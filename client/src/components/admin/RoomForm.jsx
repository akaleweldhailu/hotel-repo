  const RoomForm = (props) => {
    if (fetching) {
      return (
        <div style={styles.center}>
          <div className="spinner"></div>
          <p>Loading room data...</p>
        </div>
      );
    }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          {isEditMode ? 'Edit Room' : 'Add New Room'}
        </h1>
        <button 
          onClick={() => navigate('/admin/rooms')}
          style={styles.backBtn}
        >
          ← Back to Rooms
        </button>
      </div>

      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            {/* Room Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Room Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Deluxe Room, Family Suite"
                style={styles.input}
                required
                disabled={loading}
              />
            </div>

            {/* Price */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Price per night ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 120"
                style={styles.input}
                min="0"
                step="0.01"
                required
                disabled={loading}
              />
            </div>

            {/* Max Guests */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Maximum Guests *
              </label>
              <select
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleChange}
                style={styles.input}
                disabled={loading}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5 Guests</option>
                <option value="6">6 Guests</option>
              </select>
            </div>

            {/* Availability */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Availability
              </label>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  id="isAvailable"
                  style={styles.checkbox}
                  disabled={loading}
                />
                <label htmlFor="isAvailable" style={styles.checkboxLabel}>
                  Room is available for booking
                </label>
              </div>
            </div>

            {/* Description */}
            <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
              <label style={styles.label}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the room features, size, view, etc."
                style={{ ...styles.input, minHeight: '100px' }}
                required
                disabled={loading}
                rows="4"
              />
            </div>

            {/* Image URL */}
            <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
              <label style={styles.label}>
                Room Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/room-image.jpg"
                style={styles.input}
                disabled={loading}
              />
              <p style={styles.helpText}>
                Paste a direct image URL. You can use images from Unsplash.
              </p>
            </div>

            {/* Amenities */}
            <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
              <label style={styles.label}>
                Amenities
              </label>
              <div style={styles.amenitiesSection}>
                <div style={styles.amenityInput}>
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add an amenity (e.g., WiFi, Pool, Spa)"
                    style={styles.input}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    style={styles.addAmenityBtn}
                    disabled={loading}
                  >
                    Add
                  </button>
                </div>
                
                <div style={styles.amenitiesList}>
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} style={styles.amenityItem}>
                      <span>{amenity}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(amenity)}
                        style={styles.removeAmenityBtn}
                        disabled={loading}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
              <label style={styles.label}>
                Room Preview
              </label>
              <div style={styles.preview}>
                <img 
                  src={formData.image} 
                  alt="Room preview"
                  style={styles.previewImage}
                />
                <div style={styles.previewInfo}>
                  <h4 style={styles.previewName}>{formData.name || 'Room Name'}</h4>
                  <p style={styles.previewDescription}>
                    {formData.description.substring(0, 100) || 'Room description will appear here...'}
                  </p>
                  <div style={styles.previewDetails}>
                    <span style={styles.previewPrice}>
                      ${formData.price || '0'}/night
                    </span>
                    <span style={styles.previewGuests}>
                      Max {formData.maxGuests} guests
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={styles.formActions}>
            <button
              type="button"
              onClick={() => navigate('/admin/rooms')}
              style={styles.cancelBtn}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEditMode ? 'Update Room' : 'Create Room')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
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
  backBtn: {
    padding: '10px 20px',
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
  formContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
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
    fontSize: '0.95rem',
  },
  input: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    width: '100%',
    boxSizing: 'border-box',
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
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '8px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '0.95rem',
    color: '#34495e',
    cursor: 'pointer',
  },
  helpText: {
    fontSize: '0.85rem',
    color: '#7f8c8d',
    marginTop: '5px',
    marginBottom: '0',
  },
  amenitiesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  amenityInput: {
    display: 'flex',
    gap: '10px',
  },
  addAmenityBtn: {
    padding: '12px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    whiteSpace: 'nowrap',
    ':hover:not(:disabled)': {
      backgroundColor: '#2980b9',
    },
    ':disabled': {
      backgroundColor: '#95a5a6',
      cursor: 'not-allowed',
    },
  },
  amenitiesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  amenityItem: {
    backgroundColor: '#ecf0f1',
    padding: '8px 15px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
  },
  removeAmenityBtn: {
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: 'rgba(231, 76, 60, 0.1)',
    },
    ':disabled': {
      color: '#95a5a6',
      cursor: 'not-allowed',
    },
  },
  preview: {
    border: '1px solid #eee',
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    maxWidth: '500px',
  },
  previewImage: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
  },
  previewInfo: {
    padding: '15px',
    flex: '1',
  },
  previewName: {
    margin: '0 0 10px 0',
    color: '#2c3e50',
  },
  previewDescription: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    margin: '0 0 15px 0',
    lineHeight: '1.4',
  },
  previewDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewPrice: {
    fontWeight: 'bold',
    color: '#27ae60',
    fontSize: '1.1rem',
  },
  previewGuests: {
    backgroundColor: '#f8f9fa',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    color: '#7f8c8d',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  cancelBtn: {
    padding: '12px 30px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover:not(:disabled)': {
      backgroundColor: '#7f8c8d',
    },
    ':disabled': {
      backgroundColor: '#bdc3c7',
      cursor: 'not-allowed',
    },
  },
  submitBtn: {
    padding: '12px 30px',
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
};

export default RoomForm;