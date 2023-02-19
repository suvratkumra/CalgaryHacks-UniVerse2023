import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ChatRoom = ({ roomName }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const newSocket = io(`http://localhost:3001`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('joinRoom', roomName);
      socket.on('message', (message) => {
        setMessages((prevState) => [...prevState, message]);
      });
    }
    return () => {
      if (socket) {
        socket.emit('leaveRoom', roomName);
      }
    };
  }, [socket, roomName]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = { content: newMessage, user: 'test user', room: roomName };
    socket.emit('message', message);
    setNewMessage('');
  };

  return (
    <div>
      <h2>Chat Room: {roomName}</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <strong>{message.user}: </strong>
            {message.content}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" value={newMessage} onChange={(event) => setNewMessage(event.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
