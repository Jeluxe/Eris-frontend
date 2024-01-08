import { createContext, useContext, useRef, useState } from "react";
import { useMediaActions, useMediasoup, useSocketIO } from "../hooks";

export const Context = createContext()

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('offline')
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [friendList, setFriendList] = useState([])
  const [inCall, setInCall] = useState({
    activeCall: false,
    roomID: null
  });
  const callRef = useRef(inCall);
  const videoContainer = useRef();
  const [incomingCall, setIncomingCall] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showChat, setShowChat] = useState(true);
  const [smallDevice, setSmallDevice] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const mediaActions = useMediaActions();
  const {
    socketConnect,
    socketDisconnect,
    emitData,
    addSocketEvent,
    removeSocketEvent,
  } = useSocketIO("http://localhost:4000")
  const { mute: muteToggle, video: videoToggle } = mediaActions;
  const {
    call, localVideoRef, remoteStreams, closeConnection
  } = useMediasoup({
    userID: user.id,
    videoContainer,
    videoToggle,
    muteToggle,
    socket: {
      emitData,
      addSocketEvent,
      removeSocketEvent,
    },
    inCall: inCall
  })

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
      videoContainer,

      //useMediasoup props
      call,
      localVideoRef,
      remoteStreams,
      closeConnection,

      //useSocketIO props
      socketConnect,
      socketDisconnect,
      emitData,
      addSocketEvent,
      removeSocketEvent,
    }}>
      {children}
    </Context.Provider>
  )
}

export const useStateProvider = () => useContext(Context);