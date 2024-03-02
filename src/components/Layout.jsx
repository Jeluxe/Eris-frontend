import { useEffect, useMemo, useState } from "react";
import { Outlet, useMatch, useMatches, useNavigate, useParams } from "react-router";
import { fetchData, refresh } from "../api";
import { MediasoupProvider, useSocketIOProvider, useStateProvider } from "../context";
import { addIndexToRoom, handleUpdateFriendRequest, updateList } from "../functions";
import { FriendList } from "../pages";
import { IncomingCallModal, Navbar, Sidebar, StatusBox } from "./";

const Layout = () => {
  const navigate = useNavigate();
  const match = useMatch("/");
  const matches = useMatches();
  const params = useParams();

  const {
    user,
    setUser,
    setStatus,
    rooms,
    setRooms,
    setFriendList,
    setSelectedRoom,
    setMessages,
    callRef,
    inCall,
    incomingCall,
    setIncomingCall,
    showChat,
    smallDevice,
    setSmallDevice,
    processRooms,
    showIncomingCallModal,
    setShowIncomingCallModal
  } = useStateProvider();

  const {
    socketConnect,
    socketDisconnect,
    addSocketEvent,
    removeSocketEvent,
    emitData
  } = useSocketIOProvider();

  const [burgerMenu, setBurgerMenu] = useState(false);

  useEffect(() => {
    callRef.current = inCall;
  }, [inCall]);

  useEffect(() => {
    if (!smallDevice) {
      setBurgerMenu(false);
    } else {
      setBurgerMenu(true);
    }
  }, [smallDevice]);

  useEffect(() => {
    if (user) {
      socketConnect(user);
      setStatus("online");
      fetchData(user.id).then(({ rooms: fetchedRooms, friends }) => {
        setRooms(fetchedRooms.map(addIndexToRoom));
        setFriendList(friends);
        addSocketListeners();
      });

      return () => {
        cleanupSocketListeners();
        socketDisconnect();
      }
    }
  }, [user]);

  useEffect(() => {
    if (rooms?.length && matches[1]?.params?.id) {
      const foundRoom = rooms.find(room => room.id === matches[1].params.id || room.recipients.id === matches[1].params.id);
      if (foundRoom) {
        setSelectedRoom(foundRoom);
      } else {
        navigate('/');
      }
    }
  }, [rooms, matches]);

  useEffect(() => {
    if (rooms.length) {
      addSocketEvent('incoming-call', handleIncomingCall);
      return () => {
        removeSocketEvent('incoming-call');
      }
    }
  }, [rooms]);

  useEffect(() => {
    refresh().then(res => {
      setUser(res.data);
    }).catch(err => {
      navigate('/login');
      console.error(err.response.data.message);
    });

    const handleResize = () => {
      const width = window.innerWidth;
      setSmallDevice(width < 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []);

  const handleIncomingCall = (id) => {
    const foundRoom = rooms.find(({ recipients }) => recipients.id === id);
    if (foundRoom?.recipients) {
      const user = foundRoom.recipients;
      setIncomingCall({ active: true, roomID: foundRoom.id, user });
      setShowIncomingCallModal(true);
    }
  };

  const addSocketListeners = () => {
    addSocketEvent('user-connected', updateUserStatus);
    addSocketEvent('message', addMessageToList);
    addSocketEvent('updated-message', updateMessageList);
    addSocketEvent('recieved-new-friend-request', handleNewFriendRequest);
    addSocketEvent('updated-friend-request', handleUpdatedFriendRequest);
  };

  const cleanupSocketListeners = () => {
    removeSocketEvent('user-connected');
    removeSocketEvent('message');
    addSocketEvent('updated-message');
    removeSocketEvent('recieved-new-friend-request');
    removeSocketEvent('updated-friend-request');
  };

  const addMessageToList = (newMessage) => {
    setMessages((prevMessages) => ({ ...prevMessages, [newMessage.rid]: [...prevMessages[newMessage.rid], newMessage] }));
    processRooms(newMessage.rid, (fn, rooms) => {
      emitData("get-room", lastMessageID, (returnedRoom) => {
        fn([returnedRoom, ...rooms]);
      });
    });
  }

  const updateMessageList = (updatedMessage) => {
    console.log(updatedMessage)
    if (updatedMessage.updateType === "edited") {
      setMessages((prevMessages) => ({ ...prevMessages, [updatedMessage.rid]: [...prevMessages[updatedMessage.rid].map(message => (message.id === updatedMessage.id) ? updatedMessage : message)] }));
    } else if (updatedMessage.updateType === "deleted") {
      setMessages((prevMessages) => ({ ...prevMessages, [updatedMessage.rid]: [...prevMessages[updatedMessage.rid].filter(message => message.id !== updatedMessage.id)] }));
    }
  }

  const updateUserStatus = (id, status) => {
    setRooms((rooms) => [...updateList(rooms, "recipients", id, status)]);
    setFriendList((friendList) => [...updateList(friendList, "user", id, status)]);
  }

  const handleNewFriendRequest = (newFriendRequest) => {
    setFriendList(prevRequests => [...prevRequests, newFriendRequest]);
  };

  const handleUpdatedFriendRequest = (updatedFriendRequest) => {
    setFriendList(prevRequests => handleUpdateFriendRequest(prevRequests, updatedFriendRequest));
  };

  const isUserInCall = useMemo(() => {
    return inCall.activeCall && matches[1]?.params?.id === inCall.roomID;
  }, [inCall, matches]);

  if (!user) {
    return <div>loading</div>;
  }

  return (
    <MediasoupProvider>
      {showIncomingCallModal && incomingCall?.roomID !== params?.id && incomingCall.active ? <IncomingCallModal /> : ""}
      <div className="app">
        {(smallDevice && burgerMenu) || (!smallDevice) ?
          <div className={!smallDevice ? "left-side" : "left-side-sm"}>
            <Sidebar
              smallDevice={smallDevice}
              setBurgerMenu={smallDevice ? setBurgerMenu : ""} />
            <StatusBox />
          </div>
          : null}
        <div className={`right-side ${smallDevice && burgerMenu ? "hide" : ""}`}>
          <Navbar
            isUserInCall={isUserInCall}
            setBurgerMenu={setBurgerMenu}
          />
          <main
            className="outlet"
            style={{
              display: isUserInCall ? (showChat || match ? "" : "none") : "",
            }}
          >
            {match ? <FriendList /> : <Outlet />}
          </main>
        </div>
      </div>
    </MediasoupProvider >
  );
};

export default Layout;
