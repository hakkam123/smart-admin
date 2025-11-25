'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import io from 'socket.io-client';
import { 
  FiSearch, 
  FiMoreVertical, 
  FiSend, 
  FiPaperclip, 
  FiMic,
  FiPhone,
  FiVideo,
  FiInfo,
  FiStar,
  FiCheck,
  FiSmile,
  FiImage,
  FiFile,
  FiMessageCircle
} from 'react-icons/fi';

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const { user } = useUser();
  
  // socket reference across renders
  const socketRef = useRef(null);

  // Messages for selected chat
  const [messages, setMessages] = useState([]);

  // Fetch conversation partners for current user (seller/buyer)
  useEffect(() => {
    if (!user?.id) return;

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
    const fetchPartners = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/chat?receiverId=${user.id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped = data.map(p => ({
            id: p.id,
            name: p.name,
            lastMessage: p.lastMessage || '',
            time: p.lastAt ? new Date(p.lastAt).toLocaleString() : '',
            unread: p.unread || 0,
            avatar: p.image || '/api/placeholder/40/40',
            status: 'offline',
            isTyping: false,
          }));
          setConversations(mapped);
          if (mapped.length > 0) setSelectedChat(mapped[0]);
        }
      } catch (err) {
        console.error('Failed to fetch conversation partners:', err);
      }
    };

    fetchPartners();
  }, [user]);

  // initialize socket connection for realtime messages
  useEffect(() => {
    if (!user?.id) return;

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (!SOCKET_URL) {
      console.warn('NEXT_PUBLIC_SOCKET_URL not set; realtime disabled');
      return;
    }

    // create socket and join user's room
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'], withCredentials: true });
    socketRef.current.on('connect', () => {
      console.log('Socket connected (admin UI):', socketRef.current.id);
      socketRef.current.emit('joinRoom', user.id);
    });

    const handleNewMessage = (msg) => {
      try {
        // msg expected to include senderId, receiverId, content, id, createdAt
        // update messages if relevant (avoid duplicates)
        const isRelevant = (msg.senderId === user.id && msg.receiverId === selectedChat?.id) || (msg.senderId === selectedChat?.id && msg.receiverId === user.id);
        if (isRelevant) {
          setMessages(prev => {
            const mapped = { id: msg.id, text: msg.content, sender: msg.senderId === user.id ? 'admin' : 'user', time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'delivered' };
            if (!Array.isArray(prev)) return [mapped];
            if (prev.some(m => String(m.id) === String(msg.id))) return prev;
            return [...prev, mapped];
          });
        }

        // update partner preview in sidebar; if partner missing, add it
        setConversations(prev => {
          const partnerId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
          const found = prev.some(c => c.id === partnerId);
          const updated = prev.map(c => c.id === partnerId ? { ...c, lastMessage: msg.content, time: new Date(msg.createdAt).toLocaleString() } : c);
          if (!found) {
            return [{ id: partnerId, name: partnerId, lastMessage: msg.content, time: new Date(msg.createdAt).toLocaleString(), unread: 0, avatar: '/api/placeholder/40/40', status: 'offline', isTyping: false }, ...updated];
          }
          return updated;
        });
      } catch (e) {
        console.error('Error handling newMessage event:', e);
      }
    };

    socketRef.current.on('newMessage', handleNewMessage);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('newMessage', handleNewMessage);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, selectedChat]);

  // fetch messages for selected conversation
  useEffect(() => {
    if (!user?.id || !selectedChat) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/chat?senderId=${user.id}&receiverId=${selectedChat.id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped = data.map(m => ({
            id: m.id,
            text: m.content,
            sender: m.senderId === user.id ? 'admin' : 'user',
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'delivered'
          }));
          setMessages(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch messages for selected chat:', err);
      }
    };

    fetchMessages();
  }, [user, selectedChat]);

  const handleSendMessage = async () => {
    if (!user?.id || !selectedChat || !newMessage.trim()) return;

    const payload = {
      senderId: user.id,
      receiverId: selectedChat.id,
      content: newMessage.trim(),
    };

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const saved = await res.json();
      if (saved?.id) {
        const newMsg = { id: saved.id, text: saved.content, sender: 'admin', time: new Date(saved.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'sent' };
        setMessages(prev => {
          if (!Array.isArray(prev)) return [newMsg];
          if (prev.some(m => String(m.id) === String(newMsg.id))) return prev;
          return [...prev, newMsg];
        });
        setNewMessage('');

        // update conversation preview
        setConversations(prev => prev.map(c => c.id === selectedChat.id ? { ...c, lastMessage: newMsg.text, time: newMsg.time } : c));
        // emit via socket so other party receives in realtime
        if (socketRef.current) {
          try { socketRef.current.emit('sendMessage', saved); } catch (e) { console.warn('socket emit failed', e); }
        }
      }
    } catch (err) {
      console.error('Failed sending message:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const DoubleCheck = () => (
    <div className="flex">
      <FiCheck size={10} className="-mr-1" />
      <FiCheck size={10} />
    </div>
  );

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">All Messages</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">103</span>
              <button className="text-gray-400 hover:text-gray-600">
                <FiMoreVertical size={20} />
              </button>
            </div>
          </div>
          
          {/* Message Filter Tabs */}
          <div className="flex space-x-4 mb-4">
            <button className="text-sm font-medium text-gray-900 border-b-2 border-orange-500 pb-2">
              All Messages
            </button>
            <button className="text-sm text-gray-500 hover:text-gray-700 pb-2">
              Unread
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={16} />
            <input
              type="text"
              placeholder="Cari pesan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedChat(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat?.id === conversation.id ? 'bg-orange-50 border-r-2 border-r-orange-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  {/* Status Indicator */}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(conversation.status)} rounded-full border-2 border-white`}></div>
                </div>

                {/* Message Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conversation.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.isTyping ? (
                        <span className="text-orange-600 italic">sedang mengetik...</span>
                      ) : (
                        conversation.lastMessage
                      )}
                    </p>
                    {conversation.unread > 0 && (
                      <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {selectedChat.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(selectedChat.status)} rounded-full border-2 border-white`}></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedChat.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedChat.isTyping ? 'sedang mengetik...' : 'online'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <FiPhone size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <FiVideo size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <FiInfo size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'admin'
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className={`flex items-center justify-between mt-1 ${
                      message.sender === 'admin' ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">{message.time}</span>
                      {message.sender === 'admin' && (
                        <div className="ml-2">
                          {message.status === 'read' && <DoubleCheck />}
                          {message.status === 'delivered' && <FiCheck size={12} />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <FiPaperclip size={20} />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ketik pesan anda disini..."
                    className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    <FiSmile size={18} />
                  </button>
                </div>

                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FiMessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* User Information Sidebar */}
      {selectedChat && (
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          {/* User Profile */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-xl font-medium text-gray-600">
                {selectedChat.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{selectedChat.name}</h3>
            <p className="text-sm text-gray-600 mt-2">
              Jl. Kol. Edy Martadinata Jl. Kol. Ahmad Syam <strong>No.45 E</strong>, RT.04/RW.10, Tanah Baru, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16154
            </p>
          </div>

          {/* Suggest Promo Section */}
          <div className="bg-yellow-100 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Suggest Promo</h4>
            <div className="bg-yellow-200 rounded-lg h-32 flex items-center justify-center">
              <span className="text-gray-600">Promo Content</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
              <FiPhone className="text-gray-400" size={20} />
              <span className="text-gray-700">Call Customer</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
              <FiStar className="text-gray-400" size={20} />
              <span className="text-gray-700">Add to Favorites</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
              <FiInfo className="text-gray-400" size={20} />
              <span className="text-gray-700">Customer Details</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}