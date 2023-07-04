import "@/styles/globals.css";
import Web3ContextProvider from "@/context/web3Context";

export default function App({ Component, pageProps }) {
  return (
    <Web3ContextProvider>
      <Component {...pageProps} />
    </Web3ContextProvider>
  );
}
