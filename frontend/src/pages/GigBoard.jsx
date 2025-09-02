import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import GigCard from '../components/GigCard';

const boardStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const formStyle = { marginBottom: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px' };
const inputStyle = { width: '100%', padding: '10px', margin: '5px 0', boxSizing: 'border-box' };
const buttonStyle = { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

function GigBoard() {
    const { auth } = useContext(AuthContext);
    const [gigs, setGigs] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (!auth.token) return;

        // Fetch existing gigs
        const fetchGigs = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/gigs`, {
                    headers: { Authorization: `Bearer ${auth.token}` }
                });
                setGigs(response.data);
            } catch (error) {
                console.error("Failed to fetch gigs:", error);
            }
        };
        fetchGigs();

        // Setup WebSocket for real-time updates
        const wsUrl = import.meta.env.VITE_API_URL.replace(/^http/, 'ws') + `/ws/gigs?token=${auth.token}`;
        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
            const newGig = JSON.parse(event.data);
            setGigs(prevGigs => [newGig, ...prevGigs]);
        };
        ws.onopen = () => console.log("Gig WebSocket connected");
        ws.onclose = () => console.log("Gig WebSocket disconnected");

        return () => ws.close();
    }, [auth.token]);

    const handlePostGig = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/gigs`,
                { title, description },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            // Optimistically update gigs immediately
            setGigs(prev => [response.data, ...prev]);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error("Failed to post gig:", error);
            alert("Failed to post gig. Only sponsors can post gigs.");
        }
    };

    return (
        <div>
            <h1>Gig Board</h1>

            {/* Post Gig Form only for Sponsors */}
            {auth.user?.role === 'Sponsor' && (
                <form onSubmit={handlePostGig} style={formStyle}>
                    <h3>Post a New Gig</h3>
                    <input
                        type="text"
                        placeholder="Gig Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        style={inputStyle}
                        required
                    />
                    <textarea
                        placeholder="Gig Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        style={inputStyle}
                        rows="4"
                        required
                    />
                    <button type="submit" style={buttonStyle}>Post Gig</button>
                </form>
            )}

            {/* Gig List */}
            <div style={boardStyle}>
                {gigs.length > 0 ? (
                    gigs.map(gig => <GigCard key={gig.ID || gig.id} gig={gig} />)
                ) : (
                    <p>No gigs posted yet.</p>
                )}
            </div>
        </div>
    );
}

export default GigBoard;
