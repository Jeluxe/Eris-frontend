import { useEffect, useState } from "react";
import { Outlet, useMatch, useMatches, useNavigate } from "react-router";
import { fetchData, refresh } from "../api";
import { useStateProvider } from "../context";
import { Navbar, Sidebar, StatusBox } from "./";
import { FriendList } from "../pages";
import { getRandomColor } from "../functions";

const Layout = () => {
  const navigate = useNavigate()
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
    setSelectedRoom,
    setMessages,
    callRef,
    call,
    showChat,
    smallDevice,
    setSmallDevice,
    socketConnect,
    socketDisconnect,
    addSocketEvent,
    removeSocketEvent
  } = useStateProvider()

  const [height, setHeight] = useState(null);
  const [burgerMenu, setBurgerMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    callRef.current = call;
  }, [call]);

  useEffect(() => {
    if (!smallDevice) {
      setBurgerMenu(false);
    }
  }, [smallDevice]);

  useEffect(() => {
    toggleSmallScreen(callRef, window.innerWidth);
  }, [burgerMenu, call]);

  useEffect(() => {
    if (user) {
      socketConnect(user)
      setStatus("online")
      fetchData(user.id).then(({ rooms, friends }) => {
        setRooms(rooms)
        setFriendList(friends)
        setLoading(false)
      })
    }
  }, [user]);

  useEffect(() => {
    if (rooms.length && matches && matches[1] && matches[1].pathname.includes("/@me/")) {
      const foundRoom = rooms.find(room => {
        return room?.user.id === matches[1].params.id
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
        setSelectedRoom(newTempRoom)
      }
      else if (foundRoom) {
        setSelectedRoom(foundRoom)
      } else {
        setSelectedRoom(null);
        navigate('/')
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

    addSocketEvent('connect', () => console.log('connected'))
    addSocketEvent('connected', updateUserStatus)
    addSocketEvent('disconnect', () => console.log('disconnected'))
    addSocketEvent('message', updateMessageList)

    window.addEventListener("resize", e => {
      const width = e.currentTarget.innerWidth;
      toggleSmallScreen(callRef, width);
    });

    return () => {
      removeSocketEvent('connect')
      removeSocketEvent('disconnect')
      removeSocketEvent('message')
      socketDisconnect()
      window.removeEventListener('resize', () => { })
    }
  }, [])

  const updateMessageList = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage])
  }

  const updateUserStatus = (id, status) => {
    setRooms((prevRooms) => [...prevRooms.map(room => {
      if (room?.user?.id === id) {
        return {
          ...room,
          user: {
            ...room.user,
            status
          }
        }
      }
    })])
  }

  const toggleSmallScreen = (callRef, width) => {
    setHeight(
      width < 1024
        ? `calc(100vh - ${callRef.current.inCall ? "258px" : "190px"})`
        : `calc(100vh - ${callRef.current.inCall ? "300px" : "234px"})`
    );
    setSmallDevice(width < 1024 ? true : false);
  };

  const condition = call.inCall && matches[1]?.params.id === call.roomId

  if (loading) {
    return <div>loading</div>
  }

  return (
    <div>
      <div className="app">
        {
          (smallDevice && burgerMenu) || (!smallDevice) ?
            <div className={!smallDevice ? "left-side" : "left-side-sm"}>
              <Sidebar
                smallDevice={smallDevice}
                height={height}
                call={call}
                setBurgerMenu={smallDevice ? setBurgerMenu : ""} />
              <StatusBox
                call={call}
              />
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
            call={call}
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
    </div >
  );
};

export default Layout;
