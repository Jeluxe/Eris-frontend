import { createContext, useContext, useRef, useState } from "react";
import { useAudioActions, useSocketIO } from "../hooks";

export const Context = createContext()

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('offline')
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [friendList, setFriendList] = useState([])
  const [call, setCall] = useState({
    inCall: false,
    roomId: null
  });
  const [messages, setMessages] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showChat, setShowChat] = useState(true);
  const [smallDevice, setSmallDevice] = useState(false);
  const audioActions = useAudioActions();
  const {
    socketConnect,
    emitData,
    addSocketEvent,
    removeSocketEvent,
  } = useSocketIO()
  const callRef = useRef(call);

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
      call,
      setCall,
      showChat,
      setShowChat,
      audioActions,
      callRef,
      selectedFilter,
      setSelectedFilter,
      smallDevice,
      setSmallDevice,
      messages,
      setMessages,

      socketConnect,
      emitData,
      addSocketEvent,
      removeSocketEvent,
    }}>
      {children}
    </Context.Provider>
  )
}

export const useStateProvider = () => useContext(Context)