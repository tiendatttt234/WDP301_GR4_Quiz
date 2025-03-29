// UnauthorizedPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#f8f9fa'
    },
    statusCode: {
      fontSize: '5rem',
      fontWeight: 'bold',
      color: '#dc3545',
      marginBottom: '1rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    message: {
      fontSize: '1.2rem',
      marginBottom: '2rem',
      color: '#6c757d'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
      textDecoration: 'none'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.statusCode}>401</div>
      <h1 style={styles.title}>Unauthorized Access</h1>
      <p style={styles.message}>
        You don't have permission to access this page. Please contact an administrator if you believe this is an error.
      </p>
      <Link to="/" style={styles.button}>
        Return to Home
      </Link>
    </div>
  );
};

export default UnauthorizedPage;