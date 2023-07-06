import { Contract } from "ethers";
import { useMemo } from "react";
import { useWeb3Context } from "@/context/web3Context";
//import ABI from "../contracts/DigitalBadge/DigitalBadge.json"
import ABI from "../../artifacts/contracts/DigitalBadge.sol/DigitalBadge.json"

const address = "0x933296b7a72C11b72AfaFBA3A9B2095A30321098";

const useDigitalBadgeContract = () => {
  const { state } = useWeb3Context() 

  return useMemo(
    () => state.signer && new Contract(address, ABI.abi, state.signer),
    [state.signer]
  );
};

export default useDigitalBadgeContract;
