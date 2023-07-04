import { createContext, FC, ReactNode, useContext } from "react";
import useWeb3Provider from "../hooks/useWeb3Provider";



const Web3Context = createContext();



const Web3ContextProvider = ({ children }) => {
  const { connectWallet, disconnect, state } = useWeb3Provider();

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        disconnect,
        state,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3ContextProvider;

export const useWeb3Context = () => useContext(Web3Context);
