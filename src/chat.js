import React, { useState, useEffect } from 'react';
import './App.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    ws.onopen = () => console.log('Connected');
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    setWs(ws);
    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (ws && input && username) {
      const message = {
        username: username,
        text: input,
      };
      setInput('');
      ws.send(JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, message]);
      setUsername('');
    }
  };

  return (
    <div className='wrapper'>
      <div>
        {messages.map((message, index) => (
          <div className='message' key={index}>
            <span className='username'>{message.username}: </span>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
