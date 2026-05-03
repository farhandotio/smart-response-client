import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

export const connectSocket = (companyId) => {
  if (!socket.connected) {
    socket.connect();
    socket.on('connect', () => {
      console.log('[Socket] Connected');
      if (companyId) {
        socket.emit('join-company', companyId);
      }
    });
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
