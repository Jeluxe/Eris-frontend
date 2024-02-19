import { useEffect, useMemo, useState } from "react";
import { Outlet, useMatch, useMatches, useNavigate } from "react-router";
import { fetchData, refresh } from "../api";
import { MediasoupProvider, useSocketIOProvider, useStateProvider } from "../context";
import { addIndexToRoom, handleUpdateFriendRequest, updateList } from "../functions";
import { FriendList } from "../pages";
import { Navbar, Sidebar, StatusBox } from "./";

const Layout = () => {
  const navigate = useNavigate();
  const match = useMatch("/");
  const matches = useMatches();

  const {
    user,
    setUser,
    setStatus,
    rooms,
    setRooms,
    friendList,
    setFriendList,
    selectedRoom,
    setSelectedRoom,
    setMessages,
    callRef,
    inCall,
    showChat,
    smallDevice,
    setSmallDevice,
  } = useStateProvider();

  const {
    socketConnect,
    socketDisconnect,
    addSocketEvent,
    removeSocketEvent
  } = useSocketIOProvider()

  const [burgerMenu, setBurgerMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    callRef.current = inCall;
  }, [inCall]);

  useEffect(() => {
    if (!smallDevice) {
      setBurgerMenu(false);
    } else {
      setBurgerMenu(true)
    }
  }, [smallDevice]);

  useEffect(() => {
    if (user) {
      socketConnect(user);
      setStatus("online");
      fetchData(user.id).then(({ rooms, friends }) => {
        setRooms(rooms.map(addIndexToRoom));
        setFriendList(friends);
        setLoading(false);
        addSocketEvent('user-connected', updateUserStatus)
        addSocketEvent('message', updateMessageList)
        addSocketEvent("recieved-new-friend-request", (newFriendRequest) =>
          setFriendList(prevRequests => [...prevRequests, newFriendRequest])
        )
        addSocketEvent('updated-friend-request', (updatedFriendRequet) =>
          setFriendList(prevRequests => handleUpdateFriendRequest(prevRequests, updatedFriendRequet))
        )
      });

      return () => {
        removeSocketEvent('connect')
        removeSocketEvent('user-connected')
        removeSocketEvent('disconnect')
        removeSocketEvent('message')
        removeSocketEvent("recieved-new-friend-request")
        removeSocketEvent('updated-friend-request')
        socketDisconnect()
        window.removeEventListener('resize', () => { })
      }
    }
  }, [user]);

  useEffect(() => {
    if (rooms?.length && matches[1]?.params?.id) {
      const foundRoom = rooms.find(room => room.id === matches[1].params.id || room.recipients.id === matches[1].params.id);
      if (foundRoom) {
        setSelectedRoom(foundRoom)
      } else {
        navigate('/')
      }
    }
  }, [rooms, matches]);

  useEffect(() => {
    refresh().then(res => {
      setUser(res.data)
    }).catch(err => {
      navigate('/login')
      console.log(err.response.data.message)
    })

    window.addEventListener("resize", e => {
      const width = e.currentTarget.innerWidth;
      toggleSmallScreen(width);
    });

    return () => {
      window.removeEventListener('resize', () => { })
    }
  }, [])

  const updateMessageList = (newMessage) => {
    setMessages((prevMessages) => prevMessages[newMessage.rid].push(newMessage));
    reorderRooms(newMessage.rid)
  }

  const updateUserStatus = (id, status) => {
    setRooms((rooms) => [...updateList(rooms, "recipients", id, status)])
    setFriendList((friendList) => [...updateList(friendList, "user", id, status)])
  }

  const toggleSmallScreen = (width) => {
    setSmallDevice(width < 1024 ? true : false);
  };

  const reorderRooms = (lastMessageRoomID) => {
    const foundRoom = rooms?.find(room => room?.user?.id === lastMessageRoomID);
    if (foundRoom) {
      const filteredList = rooms?.filter(room => room?.id !== foundRoom?.id);
      const reorderedList = [foundRoom, ...filteredList].map((room, idx) => {
        return {
          ...room,
          index: idx,
        }
      });
      setRooms(reorderedList);
    }
  }

  const isUserInCall = useMemo(() => {
    return inCall.activeCall && matches[1]?.params?.id === inCall.roomID
  }, [inCall]);

  if (loading) {
    return <div>loading</div>
  }

  return (
    <MediasoupProvider>
      <div className="app">
        {
          (smallDevice && burgerMenu) || (!smallDevice) ?
            <div className={!smallDevice ? "left-side" : "left-side-sm"}>
              <Sidebar
                smallDevice={smallDevice}
                setBurgerMenu={smallDevice ? setBurgerMenu : ""} />
              <StatusBox />
            </div>
            : ""
        }
        <div className={`right-side ${smallDevice && burgerMenu ? "hide" : ""}`}>
          <Navbar
            isUserInCall={isUserInCall}
            setBurgerMenu={setBurgerMenu}
          />
          <main
            className="outlet"
            style={{
              display: isUserInCall ? showChat || match ? "" : "none" : "",
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
