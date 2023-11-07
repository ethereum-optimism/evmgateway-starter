import { useContractEvent, useContractRead } from "wagmi";
import { L2OutputOracleAbi } from "../constants/L2OutputOracleAbi";
import { goerli } from "wagmi/chains";

export const useLatestAvailableL2BlockNumberOnL1 = (
  onUpdate?: (latestL1Timestamp?: bigint) => void,
) => {
  const queryResult = useContractRead({
    abi: L2OutputOracleAbi,
    address: "0xE6Dfba0953616Bacab0c9A8ecb3a9BBa77FC15c0",
    functionName: "latestBlockNumber",
    chainId: goerli.id,
  });

  const { refetch } = queryResult;

  useContractEvent({
    abi: L2OutputOracleAbi,
    address: "0xE6Dfba0953616Bacab0c9A8ecb3a9BBa77FC15c0",
    eventName: "OutputProposed",
    chainId: goerli.id,
    listener: (events) => {
      onUpdate?.(events[0].args.l1Timestamp);
      // refetch the L2OutputOracle data when a new output is proposed
      refetch();
    },
  });

  return queryResult;
};
