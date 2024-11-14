import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChatComponent = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    // Set up axios default header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [navigate]);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:5000', {
      auth: {
        token
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('receiveMessage', (messageData) => {
      setChatHistory(prev => [...prev, messageData]);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError('Failed to connect to chat server');
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/users');
        const currentUserRole = localStorage.getItem('userRole');
        
        // Filter users based on role
        let filteredUsers = response.data;
        if (currentUserRole === 'SELLER') {
          // Sellers can only chat with customers
          filteredUsers = response.data.filter(user => user.role === 'USER');
        } else if (currentUserRole === 'USER') {
          // Customers can only chat with sellers
          filteredUsers = response.data.filter(user => user.role === 'SELLER');
        }
        
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch chat history when selecting a user
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (selectedUser) {
        try {
          const response = await axios.get(`http://localhost:5000/api/chats/history`, {
            params: {
              senderId: currentUser?.id,
              receiverId: selectedUser.id
            }
          });
          setChatHistory(response.data);
        } catch (error) {
          console.error('Error fetching chat history:', error);
          setError('Failed to load chat history');
        }
      }
    };

    fetchChatHistory();
  }, [selectedUser, currentUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedUser) {
      const messageData = {
        message,
        senderId: currentUser?.id,
        receiverId: selectedUser.id,
      };

      try {
        await axios.post('http://localhost:5000/api/chats/send', messageData);
        socket.emit('sendMessage', messageData);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message');
      }
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden" style={{ minHeight: '600px' }}>
          <div className="flex h-[600px]">
            {/* Users sidebar */}
            <div className="w-1/4 border-r border-gray-200">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#EBBE43' }}>Messages</h2>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedUser?.id === user.id 
                          ? 'bg-[#EBBE43] text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm opacity-75">{user.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
              {selectedUser ? (
                <>
                  {/* Chat header */}
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedUser.role}</p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatHistory.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            msg.senderId === currentUser?.id
                              ? 'bg-[#EBBE43] text-white'
                              : 'bg-gray-100'
                          }`}
                        >
                          <p>{msg.message}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message input */}
                  <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43]"
                        placeholder="Type a message..."
                      />
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#EBBE43] text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500">Select a user to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;