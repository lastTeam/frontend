import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from "axios";
import { useCart } from "../components/home/CartContext.jsx";

const ChatComponent = ({ receiverId }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { userId } = useCart();
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000');

    newSocket.on('connect', () => {
      setIsConnected(false);
      setError(null);
    });

    newSocket.on('connect_error', (err) => {
      setIsConnected(true);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);



  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!currentMessage.trim() || !isConnected) return;

    const messageData = {
      senderId: userId,
      receiverId,
      message: currentMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      socket.emit('sendMessage', messageData);
      await storeMessage(messageData);
      setMessageList(prev => [...prev, messageData]);
      setCurrentMessage("");
    } catch (err) {
      setError('Failed to send message');
    }
  };


  const storeMessage = async (messageData) => {
    try {
      console.log('Sending message:', messageData);
      const response = await axios.post("http://localhost:5000/api/chats/send", messageData);
      console.log('Message saved:', response.data);
    } catch (err) {
      if (err.response) {
        console.log('Error response:', err.response.data);
        setError(`Failed to save message: ${err.response.data.error}`);
      } else if (err.request) {
        setError('Failed to connect to the server');
      } else {
        setError('An unexpected error occurred');
      }
      console.error(err);
    }
  };

  

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chats/history`,
          { params: { senderId: userId, receiverId } }
        );
        setMessageList(response.data);
      } catch (error) {
        setError("Failed to fetch chat history");
        console.error(error);
      }
    };

    if (userId && receiverId) {
      fetchChatHistory();
    }
  }, [userId, receiverId]);

  useEffect(() => {
    if (!socket) return;

    socket.on('receiveMessage', (data) => {
      setMessageList(prev => [...prev, data]);
    });

    return () => socket.off('receiveMessage');
  }, [socket]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto border rounded-lg p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="h-96 overflow-y-auto mb-4 space-y-2">
        {messageList.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.senderId === userId 
                ? 'ml-auto bg-blue-500 text-white' 
                : 'bg-gray-100'
            }`}
          >
            <p className="break-words">{msg.message}</p>
            <span className="text-xs opacity-75">
              {msg.timestamp && formatTime(msg.timestamp)}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder={isConnected ? "Type a message..." : "Connecting..."}
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          disabled={!isConnected}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button 
          type="submit" 
          disabled={!isConnected || !currentMessage.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;