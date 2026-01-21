// src/components/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const goToDashboard = () => {
        window.location.href = '/main-dashboard.html';
    };


    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f7fa',
            padding: '20px',
        },
        welcome: {
            textAlign: 'center',
            maxWidth: '600px',
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        },
        title: {
            fontSize: '3rem',
            color: '#1a365d',
            marginBottom: '10px',
        },
        subtitle: {
            fontSize: '1.2rem',
            color: '#4a5568',
            marginBottom: '30px',
        },
        button: {
            backgroundColor: '#3182ce',
            color: 'white',
            border: 'none',
            padding: '15px 40px',
            fontSize: '1.1rem',
            borderRadius: '10px',
            cursor: 'pointer',
            marginTop: '20px',
            transition: 'background-color 0.3s',
        },
        buttonHover: {
            backgroundColor: '#2c5282',
        }
    };

}

export default HomePage;