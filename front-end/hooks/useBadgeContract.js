import { Contract } from "ethers";
import { useMemo } from "react";
import { useWeb3Context } from "@/context/web3Context";
import ABI from "../contracts/DigitalBadge/DigitalBadge.json"

const address = "0xAF460c3Ae975A75B1276CD49F9A6211af65B109b";

const useDigitalBadgeContract = () => {
  const { state } = useWeb3Context() 

  return useMemo(
    () => state.signer && new Contract(address, ABI.abi, state.signer),
    [state.signer]
  );
};

export default useDigitalBadgeContract;
