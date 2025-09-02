import React from 'react';
import { Link } from 'react-router-dom';

const homeStyles = {
    container: { textAlign: 'center', padding: '50px 20px' },
    title: { fontSize: '2.5rem', color: '#333' },
    subtitle: { fontSize: '1.2rem', color: '#666', marginBottom: '40px' },
    link: { margin: '0 10px', textDecoration: 'none', color: 'white', backgroundColor: '#007BFF', padding: '10px 20px', borderRadius: '5px' }
};

function Home() {
    return (
        <div style={homeStyles.container}>
            <h1 style={homeStyles.title}>Welcome to FlashHire</h1>
            <p style={homeStyles.subtitle}>The fastest way to connect with tech talent for your next big project.</p>
            <div>
                <Link to="/gigs" style={homeStyles.link}>View Gigs</Link>
                <Link to="/register" style={homeStyles.link}>Get Started</Link>
            </div>
        </div>
    );
}

export default Home;