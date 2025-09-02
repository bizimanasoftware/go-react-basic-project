import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../App';

const containerStyle = {
  border: '1px solid #ccc',
  borderRadius: '5px',
  padding: '10px',
  marginTop: '20px',
  maxWidth: '600px',
};
const messagesStyle = {
  height: '250px',
  overflowY: 'auto',
  border: '1px solid #eee',
  padding: '10px',
  marginBottom: '10px',
};
const inputContainerStyle = { display: 'flex', gap: '10px' };
const inputStyle = { flex: 1, padding: '8px' };
const buttonStyle = { padding: '8px 12px' };

function ChatBox() {
  const { auth } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!auth.token) return;

    let reconnectTimeout = null;

    const connect = () => {
      const socket = new WebSocket(`ws://localhost:8000/ws/chat?token=${auth.token}`);

      socket.onopen = () => console.log('Chat WebSocket connected');

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prev) => [...prev, message]);
      };

      socket.onclose = () => {
        console.log('Chat WebSocket disconnected. Reconnecting in 1s...');
        reconnectTimeout = setTimeout(connect, 1000); // Reconnect after 1s
      };

      socket.onerror = (err) => {
        console.error('Chat WebSocket error:', err);
        socket.close();
      };

      ws.current = socket;
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws.current) ws.current.close();
    };
  }, [auth.token]);

  const sendMessage = () => {
    if (!input.trim() || !receiverId.trim()) return;
    if (ws.current?.readyState !== WebSocket.OPEN) return;

    const message = {
      receiver_id: parseInt(receiverId, 10),
      content: input,
    };
    ws.current.send(JSON.stringify(message));

    // Optimistic UI update
    setMessages((prev) => [...prev, { ...message, sender_id: auth.user.id }]);
    setInput('');
  };

  return (
    <div style={containerStyle}>
      <div style={messagesStyle}>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender_id === auth.user.id ? 'Me' : `User ${msg.sender_id}`}:</strong> {msg.content}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={inputContainerStyle}>
        <input
          type="number"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          placeholder="Recipient User ID"
          style={{ ...inputStyle, flex: 0.5 }}
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={inputStyle}
        />
        <button onClick={sendMessage} style={buttonStyle}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
