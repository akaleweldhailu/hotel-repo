import React from 'react';

const Alert = ({ type, message, onClose }) => {
  const alertStyles = {
    success: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb'
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb'
    },
    warning: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      border: '1px solid #ffeaa7'
    },
    info: {
      backgroundColor: '#d1ecf1',
      color: '#0c5460',
      border: '1px solid #bee5eb'
    }
  };

  return (
    <div style={{ ...styles.alert, ...alertStyles[type] || alertStyles.info }}>
      {message}
      {onClose && (
        <button onClick={onClose} style={styles.closeBtn}>
          ×
        </button>
      )}
    </div>
  );
};

const styles = {
  alert: {
    padding: '15px',
    borderRadius: '5px',
    margin: '10px 0',
    position: 'relative'
  },
  closeBtn: {
    position: 'absolute',
    right: '10px',
    top: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: 'inherit'
  }
};

export default Alert;