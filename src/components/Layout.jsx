import { useEffect, useState } from "react";
import { Outlet, useMatch } from "react-router";
import { Navbar, Sidebar, StatusBox } from "./";
import { FriendList } from "../pages";
import { getUsers } from "../functions";
import { useStateProvider } from "../context";

const Layout = () => {
  const match = useMatch("/");
  const { callRef, call, setUser, showChat } = useStateProvider()
  const [height, setHeight] = useState(null);
  const [burgerMenu, setBurgerMenu] = useState(false);
  const [smallDevice, setSmallDevice] = useState(false);

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
    setUser(getUsers(1));

    window.addEventListener("resize", e => {
      const width = e.currentTarget.innerWidth;
      toggleSmallScreen(callRef, width);
    });

    return () => {
      window.removeEventListener("resize", () => { });
    };
  }, []);

  const toggleSmallScreen = (callRef, width) => {
    setHeight(
      width < 1024
        ? `calc(100vh - ${callRef.current ? "258px" : "190px"})`
        : `calc(100vh - ${callRef.current ? "300px" : "234px"})`
    );
    setSmallDevice(width < 1024 ? true : false);
  };

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
              display: call ? showChat || match ? "block" : "none" : "",
              minHeight: call && !match ? "240px" : "",
              height: `calc(100vh - ${!smallDevice
                ? call && !match
                  ? "450px"
                  : `126px`
                : call && !match
                  ? "406px"
                  : `82px`
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
