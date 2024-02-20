import { createContext, useContext } from "react";
import { useMediasoup } from "../hooks";

const MediasoupContext = createContext();

export const MediasoupProvider = ({ children }) => {
  const mediasoupOperations = useMediasoup()

  return <MediasoupContext.Provider value={mediasoupOperations}>
    {children}
  </MediasoupContext.Provider>;
}

export const useMediasoupProvider = () => useContext(MediasoupContext)