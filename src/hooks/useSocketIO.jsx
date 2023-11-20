import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocketIO = (url) => {
  const [socket, setSocket] = useState(null);
  const [socketEvents, setSocketEvents] = useState({});

  useEffect(() => {
    const newSocket = io.connect(url, { autoConnect: false });

    newSocket.on('connect', () => {
      console.log('Socket.IO connection opened');
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO connection closed');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [url]);
    
    const socketConnect = (user) => {
        if(user && socket) {
            socket.auth = user
            socket.connect()
        }
    }
    
    const emitData = (event, data) => {
        if(socket)
        socket.emit(event, data)
    }

  const addSocketEvent = (eventName, callback) => {
    setSocketEvents((prevSocketEvents) => ({
      ...prevSocketEvents,
      [eventName]: callback,
    }));

    if (socket) {
      socket.on(eventName, callback);
    }
  };

  const removeSocketEvent = (eventName) => {
    const callback = socketEvents[eventName];

    if (callback && socket) {
      socket.off(eventName, callback);
    }

    setSocketEvents((prevSocketEvents) => {
      const { [eventName]: removedEvent, ...rest } = prevSocketEvents;
      return rest;
    });
  };

  return {
    socketConnect,
    emitData,
    addSocketEvent,
    removeSocketEvent,
  };
}

// import React, { useState,useEffect,useCallback } from 'react';
// import useSocketIO from './useSocketIO';

// function MySocketIOComponent() {
    
//   const { socketConnect,sendData, addEventListener, removeEventListener } = useSocketIO('https://example.com');

//     const user = useCallback(async (data) => {
//         const userData = await axios.get('/api/get-token')
        
//         return userData
//     },[])
    
//   useEffect(() => {
//     // Subscribe to custom events
//     addEventListener('customEvent1', (data) => {
//       console.log('Custom Event 1:', data);
//     });

//     addEventListener('customEvent2', (data) => {
//       console.log('Custom Event 2:', data);
//     });

//     // Unsubscribe from events when the component unmounts
//     return () => {
//       removeEventListener('customEvent1');
//       removeEventListener('customEvent2');
//     };
//   }, [addEventListener, removeEventListener]);
    
//     const sendMessage = (message)=> {
//         sendData('message', message)
//     }
// }