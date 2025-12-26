import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <p>&copy; {new Date().getFullYear()} StaySimple Hotel Booking. All rights reserved.</p>
        <p>Simple & Easy Room Booking</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#34495e',
    color: 'white',
    padding: '2rem 0',
    textAlign: 'center',
    marginTop: 'auto'
  }
};

export default Footer;