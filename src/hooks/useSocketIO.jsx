import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocketIO = (url) => {
  const [socket, setSocket] = useState(null);
  const [socketEvents, setSocketEvents] = useState({});

  useEffect(() => {
    const newSocket = io(url, { autoConnect: false, reconnectionAttempts: 3 });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [url]);

  const socketConnect = useCallback(async (user) => {
    if (user && socket) {
      socket.auth = user;
      await socket.connect();
    }
  }, [socket]);

  const socketDisconnect = useCallback(async () => {
    if (socket) {
      await socket.disconnect();
    }
  }, [socket]);

  const emitData = useCallback((event, ...args) => {
    if (socket) {
      socket.emit(event, ...args);
    }
  }, [socket]);

  const addSocketEvent = useCallback((eventName, callback) => {
    setSocketEvents((prevSocketEvents) => ({
      ...prevSocketEvents,
      [eventName]: callback,
    }));
  }, []);

  const removeSocketEvent = useCallback((eventName) => {
    if (socket && socketEvents[eventName]) {
      socket.off(eventName, socketEvents[eventName]);

      setSocketEvents((prevSocketEvents) => {
        const { [eventName]: removedEvent, ...rest } = prevSocketEvents;
        return rest;
      });
    }
  }, [socket, socketEvents]);

  useEffect(() => {
    if (socket?.connected) {
      for (const [eventName, callback] of Object.entries(socketEvents)) {
        socket.on(eventName, callback);
      }

      return () => {
        for (const [eventName, callback] of Object.entries(socketEvents)) {
          socket.off(eventName, callback);
        }
      };
    }
  }, [socketEvents]);

  return {
    socketConnect,
    socketDisconnect,
    emitData,
    addSocketEvent,
    removeSocketEvent,
  };
};