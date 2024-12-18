import { createContext, useContext } from "react";
import { useState } from "react";
const context = createContext();

const ContextProvider = ({ children }) => {
  const [isLeadCycle, setIsLeadCycle] = useState({
    isOpen: false,
    id: null,
  });

  const values = {
    isLeadCycle,
    setIsLeadCycle,
  };
  return <context.Provider value={values}>{children}</context.Provider>;
};

export const useStateContext = () => {
  return useContext(context);
};
export default ContextProvider;
