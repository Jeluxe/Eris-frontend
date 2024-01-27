import { createContext, useContext } from "react";
import { useMediasoup } from "../hooks";
import { useStateProvider } from "./";

const MediasoupContext = createContext();

export const MediasoupProvider = ({ children }) => {
  const { user, inCall, videoContainer, muteToggle, videoToggle } = useStateProvider()

  const {
    call, localStreamRef, remoteStreams, closeConnection
  } = useMediasoup({
    userID: user?.id,
    videoContainer,
    videoToggle,
    muteToggle,
    inCall
  })

  return <MediasoupContext.Provider value={{ call, localStreamRef, remoteStreams, closeConnection }}>
    {children}
  </MediasoupContext.Provider>;
}

export const useMediasoupProvider = () => useContext(MediasoupContext)