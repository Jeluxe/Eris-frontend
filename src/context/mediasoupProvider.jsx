import { createContext, useContext } from "react";
import { useMediasoup } from "../hooks";

const MediasoupContext = createContext();

export const MediasoupProvider = ({ children }) => {
  const { call, localStream, remoteStreams, closeConnection } = useMediasoup()

  return <MediasoupContext.Provider value={{ call, localStream, remoteStreams, closeConnection }}>
    {children}
  </MediasoupContext.Provider>;
}

export const useMediasoupProvider = () => useContext(MediasoupContext)