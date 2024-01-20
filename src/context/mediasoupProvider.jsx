import { createContext, useContext } from "react";
import { useMediasoup } from "../hooks";
import { useStateProvider } from "./";


const MediasoupContext = createContext();

export const MediasoupProvider = ({ children }) => {
  const { user, inCall, videoContainer, mute: muteToggle, video: videoToggle } = useStateProvider()

  const {
    call, localVideoRef, remoteStreams, closeConnection
  } = useMediasoup({
    userID: user?.id,
    videoContainer,
    videoToggle,
    muteToggle,
    inCall
  })

  return <MediasoupContext.Provider value={{ call, localVideoRef, remoteStreams, closeConnection }}>
    {children}
  </MediasoupContext.Provider>;
}

export const useMediasoupProvider = () => useContext(MediasoupContext)