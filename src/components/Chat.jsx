import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

// Initialize socket outside the component to avoid multiple connections
const socket = io('http://localhost:5000');

const Chat = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch chat history on component mount
    const fetchMessages = async () => {
      console.log("response.data");
      try {
        const response = await axios.get("http://localhost:5000/api/chat/history", {
          params: { senderId, receiverId },
        }); 
        
          setMessages(response.data);
        
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    fetchMessages();

    // Listen for incoming messages once
    socket.on('receiveMessage', (data) => {
      if (data && data.message && data.senderId !== undefined && data.receiverId !== undefined) {
        setMessages((prevMessages) => [...prevMessages, data]);
      } else {
        console.error('Received invalid message format:', data);
      }
    });

    // Clean up on unmount
    return () => {
      socket.off('receiveMessage');
    };
  }, [senderId, receiverId, ]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;  // Prevent sending empty messages

    const messageData = {
      message: newMessage,
      senderId,
      receiverId,
    };

    try {
      console.log("aaaaa" , messageData);

      await axios.post("http://localhost:5000/api/chat/send", messageData);
      
      socket.emit('sendMessage', messageData);

      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.senderId === senderId ? 'You' : 'Other'}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
