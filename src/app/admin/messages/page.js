'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useUser, useAuth } from '@clerk/nextjs';
import io from 'socket.io-client';
import axios from 'axios';
// ensure axios sends cookies (Clerk session) for cross-origin calls
axios.defaults.withCredentials = true;
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
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [storesByUser, setStoresByUser] = useState(new Map());
  const [failedAvatars, setFailedAvatars] = useState({});
  const [failedAttachments, setFailedAttachments] = useState({});
  // presence & typing tracking
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const { user } = useUser();
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const openParam = searchParams ? searchParams.get('open') : null;
  const ensureName = searchParams ? searchParams.get('ensureName') : null;
  const ensureEmail = searchParams ? searchParams.get('ensureEmail') : null;
  
  // socket reference across renders
  const socketRef = useRef(null);

  // Messages for selected chat
  const [messages, setMessages] = useState([]);
  const [attachFiles, setAttachFiles] = useState([]);
  const [zoomSrc, setZoomSrc] = useState(null);
  const fileInputRef = useRef(null);

  const formatDateTime = (d) => {
    try {
      const dt = new Date(d);
      const now = new Date();
      const diff = now - dt;
      const oneDay = 24 * 60 * 60 * 1000;
      // If less than 24 hours ago -> show only time (HH:MM), otherwise show date + time
      if (diff < oneDay) {
        return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return dt.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return '' + d; }
  };

  // Normalize various possible shapes of store responses into {name, logo, address}
  const normalizeStore = (s) => {
    if (!s) return null;
    try {
      const name = s.name || s.storeName || s.displayName || s.ownerName || (s.user && (s.user.name || s.user.fullName)) || '';
      const logo = s.logo || s.image || s.avatar || (s.user && (s.user.avatar || s.user.image)) || '';
      let address = '';
      if (s.address) {
        if (typeof s.address === 'string') address = s.address;
        else address = s.address.name || s.address.street || s.address.formatted || JSON.stringify(s.address);
      } else if (s.location) {
        address = s.location.address || s.location.formatted || '';
      }
      return { name, logo, address, raw: s };
    } catch (e) {
      return { name: '', logo: '', address: '', raw: s };
    }
  };

  // Ensure avatar/image sources are safe to load in the browser.
  const isValidImageSrc = (s) => {
    if (!s || typeof s !== 'string') return false;
    const trimmed = s.trim();
    if (trimmed.startsWith('data:')) return true;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return true;
    // allow internal api/static asset paths
    if (trimmed.startsWith('/api/') || trimmed.startsWith('/_next/') || trimmed.startsWith('/static/') || trimmed.startsWith('/public/')) return true;
    // do NOT allow admin route paths (these would attempt to navigate or fetch HTML)
    if (trimmed.startsWith('/admin')) return false;
    return false;
  };

  // Inline SVG placeholder (avoids relying on /api/placeholder endpoint)
  const AVATAR_PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-size="14">No Image</text></svg>';
  const safeAvatarSrc = (s, fallback = AVATAR_PLACEHOLDER) => (isValidImageSrc(s) ? s : fallback);
  // Enrich a conversation with store info from storesByUser (if available)
  const enrichConversation = useCallback((conv) => {
    try {
      if (!conv) return conv;
      const ownerId = String(conv.ownerId || conv.id || '');
      const store = storesByUser.get(ownerId);
      const ns = normalizeStore(store) || null;
      if (ns) return { ...conv, name: (ns.name || conv.name), avatar: (ns.logo || conv.avatar), address: (ns.address || conv.address) };
      return conv;
    } catch (e) {
      return conv;
    }
  }, [storesByUser]);

  const handleSelectConversation = useCallback((conv) => {
    if (!conv) return;
    const enriched = enrichConversation(conv);
    setSelectedChat(enriched);
  }, [enrichConversation]);

      // Try to fetch a store for a single user id via public store routes.
      // Prefer the new public endpoint: /api/store/by-user/:userId (besukma)
      const fetchStoreForUser = useCallback(async (uid) => {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
        if (!uid) return null;
        try {
          let store = null;

          try {
            const r = await axios.get(`${API_BASE}/api/store/by-user/${uid}`, { validateStatus: (status) => status < 500 });
            if (r?.status === 200 && r?.data?.success && r.data.data) {
              store = r.data.data;
              if (process.env.NODE_ENV !== 'production') console.debug(`fetchStoreForUser: found store via /api/store/by-user for ${uid}`, store);
            } else {
              if (r?.status >= 500) console.warn(`fetchStoreForUser: server error ${r.status} when fetching store for ${uid}`);
              else if (process.env.NODE_ENV !== 'production') console.debug(`fetchStoreForUser: store not found for ${uid} (status ${r?.status})`);
            }
          } catch (e) {
            const status = e?.response?.status;
            if (status && status >= 500) console.warn(`fetchStoreForUser: request failed for ${uid} with status ${status}`);
            else if (process.env.NODE_ENV !== 'production') console.debug(`fetchStoreForUser: request error for ${uid}:`, status || e?.message || e);
          }

          if (store) {
            const ns = normalizeStore(store) || { name: '', logo: '', address: '' };
            setStoresByUser(prev => {
              const copy = new Map(prev || []);
              copy.set(String(uid), store);
              return copy;
            });

            setConversations(prev => prev.map(c => (String(c.ownerId || c.id) === String(uid) ? { ...c, name: (ns.name || c.name), avatar: (ns.logo || c.avatar), address: (ns.address || c.address) } : c)));

            setSelectedChat(prev => {
              try {
                if (!prev) return prev;
                const selOwner = String(prev.ownerId || prev.id || '');
                const selId = String(prev.id || '');
                if (selOwner === String(uid) || selId === String(uid)) return { ...prev, name: (ns.name || prev.name), avatar: (ns.logo || prev.avatar), address: (ns.address || prev.address) };
                return prev;
              } catch (e) { return prev; }
            });
          } else {
            if (process.env.NODE_ENV !== 'production') console.debug(`fetchStoreForUser: no store found for ${uid}`);
          }
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') console.warn('fetchStoreForUser error', e);
        }
      }, [/* stable */]);

  // Fetch conversation partners for current user (seller/buyer)
  useEffect(() => {
    if (!user?.id) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
    // getToken is available from the outer scope

    // Try to fetch a store for a single user id via public store routes.
    // Prefer the new public endpoint: /api/store/by-user/:userId (besukma)
    const fetchStoreForUser = async (uid) => {
      // guard: no uid -> nothing to fetch
      if (!uid) return null;
      // Many auth/user ids may be prefixed (eg. Clerk 'user_...') and not represent a seller store.
      // Allow fetching store info for any user id (including Clerk 'user_*' ids).
      try {
        let store = null;

        // 1) Try the new public endpoint we added on besukma
        try {
          const r = await axios.get(`${API_BASE}/api/store/by-user/${uid}`, { validateStatus: (status) => status < 500 });
          // 200 with data -> good
          if (r?.status === 200 && r?.data?.success && r.data.data) {
            store = r.data.data;
            if (process.env.NODE_ENV !== 'production') console.debug(`fetchStoreForUser: found store via /api/store/by-user for ${uid}`, store);
          } else {
            // 4xx responses are expected when a user hasn't created a store yet; don't spam console
            if (r?.status >= 500) {
              console.warn(`fetchStoreForUser: server error ${r.status} when fetching store for ${uid}`);
            } else {
              if (process.env.NODE_ENV !== 'production') console.debug(`fetchStoreForUser: store not found for ${uid} (status ${r?.status})`);
            }
          }
        } catch (e) {
          // axios will throw for network errors; if response exists and is <500 we've handled it above
          const status = e?.response?.status;
          if (status && status >= 500) {
            console.warn(`fetchStoreForUser: request failed for ${uid} with status ${status}`);
          } else {
            // silent for 4xx or other expected failures
            if (process.env.NODE_ENV !== 'production') console.debug(`fetchStoreForUser: request error for ${uid}:`, status || e?.message || e);
          }
        }

        if (store) {
          // normalize store info (some APIs return different shapes)
          const ns = normalizeStore(store) || { name: '', logo: '', address: '' };
          setStoresByUser(prev => {
            const copy = new Map(prev || []);
            copy.set(String(uid), store);
            return copy;
          });

          // update any conversation entries for this user with normalized values
          setConversations(prev => prev.map(c => (String(c.ownerId || c.id) === String(uid) ? { ...c, name: (ns.name || c.name), avatar: (ns.logo || c.avatar), address: (ns.address || c.address) } : c)));

          // If the currently selected chat corresponds to this owner, update it too
          setSelectedChat(prev => {
            try {
              if (!prev) return prev;
              const selOwner = String(prev.ownerId || prev.id || '');
              const selId = String(prev.id || '');
              if (selOwner === String(uid) || selId === String(uid)) {
                return { ...prev, name: (ns.name || prev.name), avatar: (ns.logo || prev.avatar), address: (ns.address || prev.address) };
              }
              return prev;
            } catch (e) { return prev; }
          });
        } else {
          if (process.env.NODE_ENV !== 'production') console.debug(`fetchStoreForUser: no store found for ${uid}`);
        }
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.warn('fetchStoreForUser error', e);
      }
    };
    const fetchPartners = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/chat`, { params: { receiverId: user.id } });
        const data = res.data;
        if (Array.isArray(data)) {
          // Build conversation entries using chat partner data, then fetch public store info per user.
          console.debug('sample chat partner response (first 2):', data.slice(0,2));
          const mapped = data.map(p => {
            // partner objects may reference the user id in different fields depending on backend
            const possibleOwner = p.userId || p.ownerId || (p.user && (p.user.id || p.user.userId)) || p.id;
            return {
              id: String(p.id),
              ownerId: String(possibleOwner),
              name: p.name,
              address: p.address?.name || '',
              lastMessage: p.lastMessage || '',
              time: p.lastAt ? formatDateTime(p.lastAt) : '',
              unread: p.unread || 0,
              avatar: p.image || '',
              status: 'offline',
              isTyping: false,
            };
          });
          setConversations(mapped);

          // For each conversation, fetch public store info (no admin auth required) and wait for results
          const missingOwnerIds = mapped.map(m => String(m.ownerId || m.id));
          const fetchPromises = missingOwnerIds.map(uid => fetchStoreForUser(uid).catch(() => {}));
          // Wait for all store lookups to settle before marking loading complete
          await Promise.allSettled(fetchPromises);

          // Do NOT auto-open a conversation here. Leave selection to the user or
          // to explicit `open` query param handling so the chat area remains unselected
          // when the Messages menu is accessed.
        }
      } catch (err) {
        console.error('Failed to fetch conversation partners:', err);
      } finally {
        // mark conversations fetch as finished (success or error)
        setConversationsLoading(false);
      }
    };

    fetchPartners();
  }, [user, fetchStoreForUser]);

  // If a URL query param requests opening a specific partner, auto-select them
  useEffect(() => {
    if (!openParam) return;
    // try to find existing conversation entry
    const found = conversations.find(c => String(c.id) === String(openParam) || String(c.ownerId || '') === String(openParam));
    if (found) {
      setSelectedChat(enrichConversation(found));
      return;
    }
    // If not found in conversations, add a minimal conversation entry (ensure reporter appears in list)
    const convId = String(openParam);
    const newConv = {
      id: convId,
      ownerId: convId,
      name: ensureName || ensureEmail || convId,
      avatar: convId,
      unread: 0,
      status: 'offline',
      lastMessage: '',
      time: ''
    };
    // avoid duplicates in case another fetch adds it concurrently
    setConversations(prev => {
      const exists = prev.find(c => String(c.id) === convId || String(c.ownerId || '') === convId);
      if (exists) return prev;
      return [newConv, ...prev];
    });
    // indicate we're still loading until store lookup completes for this reporter
    setConversationsLoading(true);
    setSelectedChat(newConv);

    // Attempt to fetch store info for this reporter via fetchStoreForUser (it includes guards)
    (async () => {
      try {
        await fetchStoreForUser(convId);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.debug('openParam store lookup failed', e?.response?.status || e.message || e);
      } finally {
        setConversationsLoading(false);
      }
    })();
  }, [openParam, conversations, ensureName, ensureEmail, enrichConversation, fetchStoreForUser]);

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
      try {
        console.log('Socket connected (admin UI):', socketRef.current.id);
        // join using string id to avoid type mismatches
        socketRef.current.emit('joinRoom', String(user.id));
        // announce presence (server must broadcast to others for presence to work)
        try { socketRef.current.emit('userOnline', { userId: String(user.id) }); } catch (e) { /* ignore */ }
      } catch (e) {
        console.warn('joinRoom emit failed', e);
      }
    });

    // rejoin on reconnect and re-announce presence
    if (socketRef.current.io) {
      socketRef.current.io.on('reconnect', () => {
        try {
          socketRef.current.emit('joinRoom', String(user.id));
          socketRef.current.emit('userOnline', { userId: String(user.id) });
        } catch (e) { /* ignore */ }
      });
    }

    // handle typing events from other clients
    const handleTypingEvent = (payload) => {
      try {
        // payload may be { from, to, typing } or { senderId, receiverId, typing }
        const from = payload?.from || payload?.senderId || payload?.userId || null;
        const to = payload?.to || payload?.receiverId || null;
        const typing = !!payload?.typing;
        if (!from) return;

        setConversations(prev => prev.map(c => c.id === String(from) ? { ...c, isTyping: typing } : c));
        if (selectedChat && String(selectedChat.id) === String(from) && typing) {
          // ensure selectedChat shows typing too
          setSelectedChat(prev => prev ? { ...prev, isTyping: true } : prev);
        }

        // auto-clear typing after a short delay if typing=true and no explicit false arrives
        if (typing) {
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setConversations(prev => prev.map(c => c.id === String(from) ? { ...c, isTyping: false } : c));
            if (selectedChat && String(selectedChat.id) === String(from)) setSelectedChat(prev => prev ? { ...prev, isTyping: false } : prev);
          }, 2500);
        }
      } catch (e) {
        console.warn('Error handling typing event', e);
      }
    };

    // handle presence events
    const handleUserOnline = (payload) => {
      try {
        const id = payload?.userId || payload?.id || payload?.user || null;
        if (!id) return;
        setConversations(prev => prev.map(c => c.id === String(id) ? { ...c, status: 'online' } : c));
        if (selectedChat && String(selectedChat.id) === String(id)) setSelectedChat(prev => prev ? { ...prev, status: 'online' } : prev);
      } catch (e) { console.warn('userOnline handler error', e); }
    };

    const handleUserOffline = (payload) => {
      try {
        const id = payload?.userId || payload?.id || payload?.user || null;
        if (!id) return;
        setConversations(prev => prev.map(c => c.id === String(id) ? { ...c, status: 'offline' } : c));
        if (selectedChat && String(selectedChat.id) === String(id)) setSelectedChat(prev => prev ? { ...prev, status: 'offline' } : prev);
      } catch (e) { console.warn('userOffline handler error', e); }
    };

        const handleNewMessage = (msg) => {
      try {
        // msg expected to include senderId, receiverId, content, id, createdAt
        // update messages if relevant (avoid duplicates)
        const isRelevant = (msg.senderId === user.id && msg.receiverId === selectedChat?.id) || (msg.senderId === selectedChat?.id && msg.receiverId === user.id);
        if (isRelevant) {
          setMessages(prev => {
            const mapped = { id: String(msg.id), text: msg.content, sender: msg.senderId === user.id ? 'admin' : 'user', time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'delivered', attachments: Array.isArray(msg.attachments) ? msg.attachments : [] };
            if (!Array.isArray(prev)) return [mapped];
            // If message already exists (we appended optimistically on send), update its status to delivered and preserve/merge attachments
            if (prev.some(m => String(m.id) === String(msg.id))) {
              return prev.map(m => String(m.id) === String(msg.id)
                ? { ...m, text: mapped.text, time: mapped.time, status: 'delivered', attachments: (Array.isArray(msg.attachments) && msg.attachments.length) ? msg.attachments : (m.attachments || []) }
                : m
              );
            }
            return [...prev, mapped];
          });
        }

        // If the incoming message was sent to me and I'm currently viewing the conversation,
        // we should mark it as read immediately (persist readAt) and notify partner.
        try {
          const amRecipient = (msg.receiverId === user.id);
          const isViewing = selectedChat && String(selectedChat.id) === String(msg.senderId);
          if (amRecipient && isViewing) {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
            // call PATCH to persist readAt on server
            (async () => {
              try {
                const patchRes = await axios.patch(`${API_BASE}/api/chat`, { partnerId: msg.senderId });
                const json = patchRes.data || {};
                const ids = (json?.messageIds && Array.isArray(json.messageIds) && json.messageIds.length) ? json.messageIds : [String(msg.id)];

                // optimistic local update
                setMessages(prev => prev.map(m => ids.includes(String(m.id)) ? { ...m, readAt: new Date().toISOString(), status: 'read' } : m));
                setConversations(prev => prev.map(p => p.id === String(selectedChat.id) ? { ...p, unread: 0 } : p));

                // notify others via socket
                try { socketRef.current?.emit('markRead', { partnerId: msg.senderId, readerId: user.id, messageIds: ids }); } catch (e) { /* ignore */ }
              } catch (e) {
                console.warn('Failed to persist mark-read for incoming message:', e?.message || e);
              }
            })();
          }
        } catch (e) { console.warn('mark-read trigger check failed', e); }

        // update partner preview in sidebar; if partner missing, add it
        setConversations(prev => {
          const partnerId = String(msg.senderId === user.id ? msg.receiverId : msg.senderId);
          const found = prev.some(c => c.id === partnerId);
          const previewText = (msg?.attachments && msg.attachments.length) ? `${msg.attachments.length} foto` : (msg.content || '');
          const updated = prev.map(c => c.id === partnerId ? { ...c, lastMessage: previewText, time: formatDateTime(msg.createdAt) } : c);
          if (!found) {
            // prefer normalized store info if available
            const store = storesByUser.get(String(partnerId));
            const ns = normalizeStore(store) || { name: '', logo: '' };
            const name = ns && ns.name ? ns.name : partnerId;
            const avatar = ns && ns.logo ? ns.logo : AVATAR_PLACEHOLDER;
            return [{ id: partnerId, name, lastMessage: previewText, time: formatDateTime(msg.createdAt), unread: 0, avatar, status: 'offline', isTyping: false }, ...updated];
          }
          return updated;
        });
        // if we just added a partner but didn't have store info, try to fetch it
        try {
          const partnerId = String(msg.senderId === user.id ? msg.receiverId : msg.senderId);
          if (!storesByUser.get(partnerId)) fetchStoreForUser(partnerId).catch(() => {});
        } catch (e) { /* ignore */ }
      } catch (e) {
        console.error('Error handling newMessage event:', e);
      }
    };

    socketRef.current.on('newMessage', handleNewMessage);
    socketRef.current.on('typing', handleTypingEvent);
    socketRef.current.on('userOnline', handleUserOnline);
    socketRef.current.on('userOffline', handleUserOffline);

    const handleMessageRead = (payload) => {
      try {
        console.log('socket messageRead payload:', payload);

        // support payload shapes: { readerId, messageIds } or { readerId, partnerId, messageIds }
        const readerId = payload?.readerId ? String(payload.readerId) : null;
        const partnerId = payload?.partnerId ? String(payload.partnerId) : null;
        const rawIds = payload?.messageIds || payload?.ids || [];
        const ids = Array.isArray(rawIds) ? rawIds.map(String) : (rawIds ? [String(rawIds)] : []);

        if (!ids.length && !readerId && !partnerId) return;

        // Update local messages: mark matching ids as read
        if (ids.length) {
          setMessages(prev => prev.map(m => ids.includes(String(m.id)) ? { ...m, readAt: new Date().toISOString(), status: 'read' } : m));
        }

        // Clear unread for conversations that match readerId or partnerId
        setConversations(prev => prev.map(p => {
          if (readerId && String(p.id) === readerId) return { ...p, unread: 0 };
          if (partnerId && String(p.id) === partnerId) return { ...p, unread: 0 };
          return p;
        }));
      } catch (e) {
        console.error('Error handling messageRead event:', e);
      }
    };

    socketRef.current.on('messageRead', handleMessageRead);

    return () => {
      if (socketRef.current) {
        try { socketRef.current.emit('userOffline', { userId: String(user.id) }); } catch (e) { /* ignore */ }
        socketRef.current.off('newMessage', handleNewMessage);
        socketRef.current.off('typing', handleTypingEvent);
        socketRef.current.off('userOnline', handleUserOnline);
        socketRef.current.off('userOffline', handleUserOffline);
        socketRef.current.off('messageRead', handleMessageRead);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, selectedChat, storesByUser, fetchStoreForUser]);

  // fetch messages for selected conversation
  useEffect(() => {
    if (!user?.id || !selectedChat) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/chat`, { params: { senderId: user.id, receiverId: selectedChat.id } });
        const data = res.data;
        if (Array.isArray(data)) {
          const mapped = data.map(m => ({
            id: String(m.id),
            text: m.content,
            sender: m.senderId === user.id ? 'admin' : 'user',
            time: formatDateTime(m.createdAt),
            status: m.readAt ? 'read' : 'delivered',
            readAt: m.readAt || null,
            attachments: Array.isArray(m.attachments) ? m.attachments : []
          }));
          setMessages(mapped);

          // mark messages from partner as read (messages where sender is partner and receiver is me)
          try {
            const patchRes = await axios.patch(`${API_BASE}/api/chat`, { partnerId: selectedChat.id });
            const json = patchRes.data;

            // Determine which message ids should be considered read locally
            const idsToMark = (Array.isArray(data) ? data : []).filter(m => String(m.senderId) === String(selectedChat.id)).map(m => m.id);

            // If server returned messageIds, prefer those; otherwise fall back to local idsToMark
            const messageIds = (json?.messageIds && json.messageIds.length) ? json.messageIds : idsToMark;

            if (messageIds.length) {
              // notify via socket (emit even if server-side update wasn't possible)
              try { socketRef.current?.emit('markRead', { partnerId: selectedChat.id, readerId: user.id, messageIds }); } catch (e) { /* ignore */ }

              // update local messages immediately so UI reflects read state live
              setMessages(prev => prev.map(msg => messageIds.includes(msg.id) ? { ...msg, readAt: new Date().toISOString(), status: 'read' } : msg));
              // update partner unread count
              setConversations(prev => prev.map(p => p.id === selectedChat.id ? { ...p, unread: 0 } : p));
            }
          } catch (err) {
            console.error('Failed to mark messages read:', err);
            // As a fallback, attempt to emit markRead based on locally-known messages
            try {
              const idsToMark = (Array.isArray(data) ? data : []).filter(m => String(m.senderId) === String(selectedChat.id)).map(m => m.id);
              if (idsToMark.length) {
                socketRef.current?.emit('markRead', { partnerId: selectedChat.id, readerId: user.id, messageIds: idsToMark });
                setMessages(prev => prev.map(msg => idsToMark.includes(msg.id) ? { ...msg, readAt: new Date().toISOString(), status: 'read' } : msg));
                setConversations(prev => prev.map(p => p.id === selectedChat.id ? { ...p, unread: 0 } : p));
              }
            } catch (e) { /* ignore */ }
          }
        }
      } catch (err) {
        console.error('Failed to fetch messages for selected chat:', err);
      }
    };

    fetchMessages();

    // fallback: re-fetch after short delays to catch missed readAt updates
    const t1 = setTimeout(() => fetchMessages(), 1000);
    const t2 = setTimeout(() => fetchMessages(), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [user, selectedChat]);

  // handle Escape key to close zoom and lock body scroll while zoom open
  useEffect(() => {
    if (!zoomSrc) return;
    const onKey = (e) => { if (e.key === 'Escape') setZoomSrc(null); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [zoomSrc]);

  const handleSendMessage = async () => {
    if (!user?.id || !selectedChat || (!newMessage.trim() && attachFiles.length === 0)) return;

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
      let saved = null;

      if (attachFiles && attachFiles.length > 0) {
        const form = new FormData();
        form.append('senderId', user.id);
        form.append('receiverId', selectedChat.id);
        form.append('content', newMessage.trim());
        attachFiles.forEach((f) => form.append('attachments', f));

        // Do NOT set Content-Type header manually for FormData - browser/axios will set boundary
        const res = await axios.post(`${API_BASE}/api/chat`, form);
        saved = res.data;
      } else {
        const payload = { senderId: user.id, receiverId: selectedChat.id, content: newMessage.trim() };
        const res = await axios.post(`${API_BASE}/api/chat`, payload);
        saved = res.data;
      }

      if (saved?.id) {
        const newMsg = { id: String(saved.id), text: saved.content, sender: 'admin', time: new Date(saved.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'sent', attachments: saved.attachments || [] };
        setMessages(prev => {
          if (!Array.isArray(prev)) return [newMsg];
          if (prev.some(m => String(m.id) === String(newMsg.id))) return prev;
          return [...prev, newMsg];
        });
        setNewMessage('');
        setAttachFiles([]);

        // update conversation preview
        setConversations(prev => prev.map(c => c.id === selectedChat.id ? { ...c, lastMessage: newMsg.text, time: newMsg.time } : c));
        // emit via socket so other party receives in realtime
        if (socketRef.current) {
          try { socketRef.current.emit('sendMessage', saved); } catch (e) { console.warn('socket emit failed', e); }
        }
        // stop typing indicator when message is sent
        try { socketRef.current?.emit('typing', { from: String(user.id), to: String(selectedChat.id), typing: false }); } catch (e) { /* ignore */ }
      }
    } catch (err) {
      console.error('Failed sending message:', err);
    }
  };

  const handleFileChange = (e) => {
    const list = Array.from(e.target.files || []);
    if (list.length) setAttachFiles(prev => [...prev, ...list]);
    e.target.value = null;
  };

  const handleRemoveAttachment = (index) => {
    setAttachFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dtFiles = Array.from(e.dataTransfer.files || []);
    if (dtFiles.length) setAttachFiles(prev => [...prev, ...dtFiles]);
  };

  const handleDragOver = (e) => { e.preventDefault(); };

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

  

  // unread count (sum of unread across conversations)
  const unreadCount = useMemo(() => conversations.reduce((sum, c) => sum + (Number(c.unread) || ""), ""), [conversations]);

  // apply active tab filter
  const visibleConversations = useMemo(() => {
    const base = filteredConversations;
    if (activeTab === 'unread') return base.filter(c => Number(c.unread) > 0);
    return base;
  }, [filteredConversations, activeTab]);

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">All Messages</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{unreadCount}</span>
              <button className="text-gray-400 hover:text-gray-600">
                <FiMoreVertical size={20} />
              </button>
            </div>
          </div>
          
          {/* Message Filter Tabs */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`text-sm font-medium pb-2 ${activeTab === 'all' ? 'text-gray-900 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'}`}>
              All Messages
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`text-sm pb-2 ${activeTab === 'unread' ? 'text-gray-900 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'}`}>
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
          {conversationsLoading ? (
            <div className="p-6 flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 text-orange-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span className="text-sm text-gray-600">Loading conversations...</span>
            </div>
          ) : (
            visibleConversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No conversations yet</div>
            ) : (
              visibleConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat?.id === conversation.id ? 'bg-orange-50 border-r-2 border-r-orange-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                      {conversation.avatar && !failedAvatars[String(conversation.id)] ? (
                        <Image
                          src={safeAvatarSrc(conversation.avatar)}
                          alt={conversation.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                          onError={() => setFailedAvatars(prev => ({ ...prev, [String(conversation.id)]: true }))}
                          unoptimized
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {conversation.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
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
              ))
            )
          )}
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
                    {selectedChat.avatar && !failedAvatars[String(selectedChat.id)] ? (
                      <Image src={safeAvatarSrc(selectedChat.avatar)} alt={selectedChat.name} width={40} height={40} className="rounded-full object-cover" onError={() => setFailedAvatars(prev => ({ ...prev, [String(selectedChat.id)]: true }))} unoptimized />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {selectedChat.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(selectedChat.status)} rounded-full border-2 border-white`}></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedChat.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedChat.isTyping ? 'sedang mengetik...' : (selectedChat.status === 'online' ? 'online' : 'offline')}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div>
                    {/* Message text bubble (only for text) */}
                    {message.text ? (
                      <div className={`${(Array.isArray(message.attachments) && message.attachments.length > 0) ? 'max-w-[500px]' : 'max-w-xs lg:max-w-md'} px-4 py-2 rounded-lg ${
                        message.sender === 'admin' ? 'bg-orange-500 text-white' : 'bg-white text-gray-900 border border-gray-200'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <div className={`flex items-center justify-between mt-1 ${message.sender === 'admin' ? 'text-orange-100' : 'text-gray-500'}`}>
                          <span className="text-xs">{message.time}</span>
                          {message.sender === 'admin' && (
                            <div className="ml-2">
                              {message.status === 'read' && <DoubleCheck />}
                              {message.status === 'delivered' && <FiCheck size={12} />}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}

                    {/* Attachments: always rendered outside the bubble, no border/box */}
                      {Array.isArray(message.attachments) && message.attachments.length > 0 && (
                        <div className={`mt-2 flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'} gap-3 flex-wrap`}>
                          {message.attachments.map((a, i) => (
                            <div key={i} className={`flex flex-col ${message.sender === 'admin' ? 'items-end' : 'items-start'} gap-1`}>
                              <Image
                                src={failedAttachments[a] ? AVATAR_PLACEHOLDER : a}
                                alt={`att-${i}`}
                                width={500}
                                height={500}
                                className="rounded-md object-cover cursor-zoom-in w-[500px] h-auto"
                                onClick={() => setZoomSrc(a)}
                                onError={() => { console.warn('Attachment load failed', a); setFailedAttachments(prev => ({ ...prev, [a]: true })); }}
                                unoptimized
                              />
                              {/* Show timestamp under attachments only when there's no text bubble (avoid duplicate timestamps) */}
                              {!message.text && i === message.attachments.length - 1 && (
                                <span className="text-xs text-gray-500">{message.time}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              ))}
              {/* Image zoom modal */}
              {zoomSrc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" role="dialog" aria-modal="true" onClick={() => setZoomSrc(null)}>
                  <div className="max-w-[95vw] max-h-[95vh] p-2" onClick={(e) => e.stopPropagation()}>
                    <Image
                      src={zoomSrc}
                      alt="zoomed"
                      width={1200}
                      height={900}
                      className="max-w-full max-h-[90vh] rounded-md shadow-lg"
                      onError={() => { console.warn('Zoom image failed to load', zoomSrc); setZoomSrc(AVATAR_PLACEHOLDER); }}
                      unoptimized
                    />
                    <button aria-label="Close image" onClick={() => setZoomSrc(null)} className="mt-2 ml-auto block text-white bg-gray-800 bg-opacity-60 px-3 py-1 rounded">Close</button>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <FiPaperclip size={20} />
                </button>
                
                <div className="flex-1 relative" onDrop={handleDrop} onDragOver={handleDragOver}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      const v = e.target.value;
                      setNewMessage(v);
                      // emit typing start/stop with debounce
                      try {
                        if (!isTypingRef.current) {
                          isTypingRef.current = true;
                          socketRef.current?.emit('typing', { from: String(user.id), to: String(selectedChat?.id || ''), typing: true });
                        }
                        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                        typingTimeoutRef.current = setTimeout(() => {
                          isTypingRef.current = false;
                          try { socketRef.current?.emit('typing', { from: String(user.id), to: String(selectedChat?.id || ''), typing: false }); } catch (e) {}
                        }, 1800);
                      } catch (e) { /* ignore */ }
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder={attachFiles.length ? `Attach ${attachFiles.length} file(s) or type a message...` : "Ketik pesan anda disini..."}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {/* <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    <FiSmile size={18} />
                  </button> */}
                </div>

                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>
            {attachFiles.length > 0 && (
              <div className="p-2 bg-white border-t border-gray-200 flex gap-2 items-center overflow-x-auto">
                {attachFiles.map((f, i) => (
                  <div key={i} className="relative">
                    <Image
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      width={80}
                      height={80}
                      className="object-cover rounded mr-2 cursor-pointer w-20 h-20"
                      onClick={() => setZoomSrc(URL.createObjectURL(f))}
                      onError={() => { console.warn('Preview load failed for file', f.name); }}
                      unoptimized
                    />
                    <button onClick={() => handleRemoveAttachment(i)} className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow">✕</button>
                  </div>
                ))}
              </div>
            )}
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
      {/* {selectedChat && ( */}
        {/* <div className="w-80 bg-white border-l border-gray-200 p-6"> */}
          {/* User Profile */}
          {/* <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4">
              {selectedChat.avatar && !failedAvatars[String(selectedChat.id)] ? (
                <Image src={safeAvatarSrc(selectedChat.avatar)} alt={selectedChat.name} width={80} height={80} className="rounded-full object-cover mx-auto mb-4" onError={() => setFailedAvatars(prev => ({ ...prev, [String(selectedChat.id)]: true }))} unoptimized />
              ) : (
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-600">
                    {selectedChat.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{selectedChat.name}</h3>
            <p className="text-sm text-gray-600 mt-2">
              {selectedChat.address || 'No address provided'}
            </p>
          </div> */}

          {/* Suggest Promo Section */}
          {/* <div className="bg-yellow-100 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Suggest Promo</h4>
            <div className="bg-yellow-200 rounded-lg h-32 flex items-center justify-center">
              <span className="text-gray-600">Promo Content</span>
            </div>
          </div> */}

          {/* Quick Actions */}
          {/* <div className="space-y-3">
            
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
              <FiStar className="text-gray-400" size={20} />
              <span className="text-gray-700">Add to Favorites</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
              <FiInfo className="text-gray-400" size={20} />
              <span className="text-gray-700">Customer Details</span>
            </button>
          </div>
        </div> */}
      {/* )} */}
    </div>
  );
}