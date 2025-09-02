import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';

const formContainerStyle = { maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white' };
const inputStyle = { width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

function TalentProfile() {
    const { auth } = useContext(AuthContext);
    const [skills, setSkills] = useState('');
    const [availability, setAvailability] = useState('Full-time');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/talent/profile`, {
                    headers: { Authorization: `Bearer ${auth.token}` }
                });
                setSkills(response.data.skills);
                setAvailability(response.data.availability);
            } catch (err) {
                console.log("No profile found, creating a new one.");
            }
        };
        if (auth.token) {
            fetchProfile();
        }
    }, [auth.token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/talent/profile`, { skills, availability }, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            setMessage('Profile updated successfully!');
        } catch (err) {
            setMessage('Failed to update profile.');
            console.error(err);
        }
    };

    return (
        <div style={formContainerStyle}>
            <h2>My Talent Profile</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Skills (comma-separated)</label>
                    <input type="text" value={skills} onChange={e => setSkills(e.target.value)} style={inputStyle} placeholder="e.g., React, Go, Docker" />
                </div>
                <div>
                    <label>Availability</label>
                    <select value={availability} onChange={e => setAvailability(e.target.value)} style={inputStyle}>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                    </select>
                </div>
                {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
                <button type="submit" style={buttonStyle}>Save Profile</button>
            </form>
        </div>
    );
}

export default TalentProfile;