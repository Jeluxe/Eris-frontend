/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Outlet, useMatch, useMatches, useNavigate } from "react-router";
import { fetchData, refresh } from "../api";
import { MediasoupProvider, useSocketIOProvider, useStateProvider } from "../context";
import { getRandomColor, updateListStatus } from "../functions";
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

  const [height, setHeight] = useState(null);
  const [burgerMenu, setBurgerMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    callRef.current = inCall;
  }, [inCall]);

  useEffect(() => {
    if (!smallDevice) {
      setBurgerMenu(false);
    }
  }, [smallDevice]);

  useEffect(() => {
    toggleSmallScreen(callRef, window.innerWidth);
  }, [burgerMenu, inCall]);

  useEffect(() => {
    if (user) {
      socketConnect(user);
      setStatus("online");
      fetchData(user.id).then(({ rooms, friends }) => {
        setRooms(rooms);
        setFriendList(friends);
        setLoading(false);
        addSocketEvent('connect', () => console.log('connected'))
        addSocketEvent('user-connected', updateUserStatus)
        addSocketEvent('disconnect', () => console.log('disconnected'))
        addSocketEvent('message', updateMessageList)
      });

      return () => {
        removeSocketEvent('connect')
        removeSocketEvent('user-connected')
        removeSocketEvent('disconnect')
        removeSocketEvent('message')
        socketDisconnect()
        window.removeEventListener('resize', () => { })
      }
    }
  }, [user]);

  useEffect(() => {
    if (rooms.length) {
      if (matches[1]) {
        const foundRoom = rooms.find(room => {
          return room?.user.id === matches[1].params.id;
        })

        const foundFriend = friendList.find(friend => friend.user.id === matches[1].params.id)

        if (foundFriend && !foundRoom) {
          const newTempRoom = {
            id: foundFriend.id,
            type: 0,
            index: 0,
            user: {
              ...foundFriend.user,
              avatar: getRandomColor(),
              status: 'offline'
            }
          }
          setRooms((prevRooms) => [...prevRooms, newTempRoom])
          setSelectedRoom(newTempRoom)
        }
        else if (foundRoom) {
          setSelectedRoom(foundRoom)
        }
        else if (!selectedRoom) {
          navigate('/')
        }
      } else if (selectedRoom && !matches[1]) {
        setSelectedRoom(null);
      }
    }
  }, [matches, rooms]);

  useEffect(() => {
    refresh().then(res => {
      setUser(res.data)
    }).catch(err => {
      navigate('/login')
      console.log(err.response.data.message)
    })

    window.addEventListener("resize", e => {
      const width = e.currentTarget.innerWidth;
      toggleSmallScreen(callRef, width);
    });

    return () => {
      window.removeEventListener('resize', () => { })
    }
  }, [])

  const updateMessageList = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage])
  }

  // const loadMoreMessages = (loadedMessages) => {
  //   setMessages((prevMessages) => [...loadedMessages, ...prevMessages])
  // }

  const updateUserStatus = (id, status) => {
    setRooms((prevRooms) => [...updateListStatus(prevRooms, id, status)])

    setFriendList((prevFriendList) => [...updateListStatus(prevFriendList, id, status)])
  }

  const toggleSmallScreen = (callRef, width) => {
    setHeight(
      width < 1024
        ? `calc(100vh - ${callRef.current.activeCall ? "258px" : "190px"})`
        : `calc(100vh - ${callRef.current.activeCall ? "300px" : "234px"})`
    );
    setSmallDevice(width < 1024 ? true : false);
  };

  const condition = inCall.activeCall && matches[1]?.params.id === inCall.roomID;

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
                height={height}
                setBurgerMenu={smallDevice ? setBurgerMenu : ""} />
              <StatusBox />
            </div>
            : ""
        }
        <div
          className="right-side"
          style={{ display: burgerMenu ? "none" : "block" }}
        >
          <Navbar
            smallDevice={smallDevice}
            match={match}
            burgerMenu={burgerMenu}
            setBurgerMenu={setBurgerMenu}
          />
          <main
            className="outlet"
            style={{
              display: condition ? showChat || match ? "block" : "none" : "",
              height: `calc(100vh - ${!smallDevice
                ? condition && !match ? "450px" : `126px`
                : condition && !match ? "407px" : `82px`
                })`,
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
