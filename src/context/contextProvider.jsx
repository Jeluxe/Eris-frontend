import { createContext, useCallback, useContext, useRef, useState } from "react";
import { useMediaActions } from "../hooks";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('offline');
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [friendList, setFriendList] = useState([]);
  const [inCall, setInCall] = useState({
    activeCall: false,
    roomID: null
  });
  const callRef = useRef(inCall);
  const videoContainerRef = useRef();
  const [incomingCall, setIncomingCall] = useState({ active: false, roomID: null, username: null });
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const [messages, setMessages] = useState({});
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showChat, setShowChat] = useState(true);
  const [smallDevice, setSmallDevice] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const mediaActions = useMediaActions();

  const getRoomName = useCallback((roomID) => {
    if (rooms.length) {
      const foundRoom = rooms.find(room => room.id === roomID);
      if (foundRoom) {
        return foundRoom.recipients.username
      }
    }
  }, [rooms])

  const processRooms = useCallback((lastMessageRoomID, callback = null) => {
    if (rooms.length) {
      const foundRoom = rooms.find(room => room.id === lastMessageRoomID);
      if (foundRoom) {
        reorderRooms([foundRoom, ...rooms.filter(room => room.id !== foundRoom.id)]);
      } else {
        callback(reorderRooms, rooms);
      }
    }
  }, [rooms]);

  const reorderRooms = useCallback((list) => {
    const reorderedList = list.map((room, idx) => ({
      ...room,
      index: idx,
    }));
    setRooms(reorderedList);
  }, []);

  return (
    <Context.Provider value={{
      user,
      setUser,
      status,
      setStatus,
      rooms,
      setRooms,
      selectedRoom,
      setSelectedRoom,
      friendList,
      setFriendList,
      inCall,
      setInCall,
      incomingCall,
      setIncomingCall,
      showChat,
      setShowChat,
      ...mediaActions,
      callRef,
      selectedFilter,
      setSelectedFilter,
      smallDevice,
      setSmallDevice,
      messages,
      setMessages,
      isOpen,
      setIsOpen,
      videoContainerRef,
      processRooms,
      getRoomName,
      showIncomingCallModal,
      setShowIncomingCallModal
    }}>
      {children}
    </Context.Provider>
  );
};

export const useStateProvider = () => useContext(Context);