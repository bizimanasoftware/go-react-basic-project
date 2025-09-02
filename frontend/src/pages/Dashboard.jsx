import React, { useContext } from 'react';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';
import ChatBox from '../components/ChatBox';

const containerStyle = { padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
const linkStyle = { display: 'inline-block', margin: '10px', textDecoration: 'none', color: '#007BFF' };

function Dashboard() {
    const { auth } = useContext(AuthContext);

    if (!auth.user) {
        return <p>Loading...</p>;
    }

    return (
        <div style={containerStyle}>
            <h1>Dashboard</h1>
            <h2>Welcome, {auth.user.name}!</h2>
            <p>Your role: {auth.user.role}</p>
            <nav>
                <Link to="/gigs" style={linkStyle}>Gig Board</Link>
                {auth.user.role === 'Talent' && <Link to="/profile" style={linkStyle}>Edit My Profile</Link>}
            </nav>
            <hr />
            <p>Simple Chat (Connect with another user by ID)</p>
            <ChatBox />
        </div>
    );
}

export default Dashboard;