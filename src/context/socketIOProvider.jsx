import { createContext, useContext } from "react";
import { useSocketIO } from "../hooks";


const SocketIOContext = createContext();

export const SocketIOProvider = ({ children }) => {
  const socketOperations = useSocketIO("http://localhost:4000");

  return <SocketIOContext.Provider value={socketOperations}>
    {children}
  </SocketIOContext.Provider >;
};

export const useSocketIOProvider = () => useContext(SocketIOContext);