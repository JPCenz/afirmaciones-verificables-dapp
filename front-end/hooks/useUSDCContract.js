import { Contract } from "ethers";
import { useMemo } from "react";
import { useWeb3Context } from "@/context/web3Context";
import ABI from "../../artifacts/contracts/USDCoin.sol/USDCoin.json"

const address = "0x1Cada203f7d343A728fd9364d4b9c927a94EEdCC";

const useUSDCContract = () => {
  const { state } = useWeb3Context()

  return useMemo(
    () => state.signer && new Contract(address, ABI.abi, state.signer),
    [state.signer]
  );
};

export default useUSDCContract;
