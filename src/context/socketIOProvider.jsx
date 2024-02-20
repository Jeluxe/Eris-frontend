import { createContext, useContext } from "react";
import { useSocketIO } from "../hooks";


const SocketIOContext = createContext();

export const SocketIOProvider = ({ children }) => {
  const socketOperations = useSocketIO("http://localhost:4000");

  return <SocketIOContext.Provider value={socketOperations}>
    {children}
  </SocketIOContext.Provider >;
}

export const useSocketIOProvider = () => useContext(SocketIOContext);
// notice - also in ***mediasoup provider***
// extract the provider to file of his own,
// and validate use and the then return the correct parameters.