import { createContext, useContext, useRef, useState } from "react";
import { useAudioActions } from "../hooks";

export const Context = createContext()

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [call, setCall] = useState(false);
  const [selected, setSelected] = useState("All");
  const [showChat, setShowChat] = useState(false);
  const audioActions = useAudioActions();
  const callRef = useRef(call);

  return (
    <Context.Provider value={{
      user,
      setUser,
      call,
      setCall,
      showChat,
      setShowChat,
      audioActions,
      callRef,
      selected,
      setSelected
    }}>
      {children}
    </Context.Provider>
  )
}

export const useStateProvider = () => useContext(Context)