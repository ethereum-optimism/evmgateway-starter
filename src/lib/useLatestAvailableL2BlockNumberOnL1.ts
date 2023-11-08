import { useContractEvent, useContractRead } from "wagmi";
import { L2OutputOracleAbi } from "../constants/L2OutputOracleAbi";
import { goerli } from "wagmi/chains";
import { L2OutputOracleAddress } from "../constants/L2OutputOracleAddress";

export const useLatestAvailableL2BlockNumberOnL1 = (
  onUpdate?: (latestL1Timestamp?: bigint) => void,
) => {
  const queryResult = useContractRead({
    abi: L2OutputOracleAbi,
    address: L2OutputOracleAddress,
    functionName: "latestBlockNumber",
    chainId: goerli.id,
  });

  const { refetch } = queryResult;

  useContractEvent({
    abi: L2OutputOracleAbi,
    address: L2OutputOracleAddress,
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
