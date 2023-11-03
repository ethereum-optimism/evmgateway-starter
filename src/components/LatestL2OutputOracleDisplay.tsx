import {
  useBlockNumber,
  useContractEvent,
  useContractRead,
  useContractReads,
} from "wagmi";
import { L2OutputOracleAbi } from "../constants/L2OutputOracleAbi";
import { goerli, optimismGoerli } from "wagmi/chains";
import { Banner } from "@ensdomains/thorin";
import { useState } from "react";

const LastUpdatedAt = ({ date }: { date?: Date }) => {
  if (!date) {
    return null;
  }

  return <div>last updated {date.toLocaleTimeString()}</div>;
};

const LatestL2OutputOracleContent = () => {
  const [latestL2OutputProposedDate, setLatestL2OutputProposedDate] =
    useState<Date>();

  const { data: latestL2Block, isLoading: isLatestL2BlockLoading } =
    useBlockNumber({
      watch: true,
      chainId: optimismGoerli.id,
    });

  const {
    data: latestL2BlockOnL1,
    isLoading: isLatestL2BlockOnL1Loading,
    refetch,
  } = useContractRead({
    abi: L2OutputOracleAbi,
    address: "0xE6Dfba0953616Bacab0c9A8ecb3a9BBa77FC15c0",
    functionName: "latestBlockNumber",
    chainId: goerli.id,
  });

  useContractEvent({
    abi: L2OutputOracleAbi,
    address: "0xE6Dfba0953616Bacab0c9A8ecb3a9BBa77FC15c0",
    eventName: "OutputProposed",
    chainId: goerli.id,
    listener: (events) => {
      events[0].args.l1Timestamp;
      setLatestL2OutputProposedDate(
        new Date(Number(events[0].args.l1Timestamp) * 1000),
      );
      // refetch the L2OutputOracle data when a new output is proposed
      refetch();
    },
  });

  if (
    !latestL2BlockOnL1 ||
    !latestL2Block ||
    isLatestL2BlockOnL1Loading ||
    isLatestL2BlockLoading
  ) {
    return <>"Loading..."</>;
  }

  const numBlocksBehind = latestL2Block - latestL2BlockOnL1;

  return (
    <div>
      {latestL2BlockOnL1.toString()} ({numBlocksBehind.toString()} blocks
      behind)
      <LastUpdatedAt date={latestL2OutputProposedDate} />
    </div>
  );
};

export const LatestL2OutputOracleDisplay = () => {
  return (
    <Banner
      title="Latest OP Goerli block available on Goerli"
      as="a"
      target="_blank"
      rel="noopener noreferrer"
      href={`${goerli.blockExplorers.default.url}/address/0xE6Dfba0953616Bacab0c9A8ecb3a9BBa77FC15c0`}
    >
      <LatestL2OutputOracleContent />
    </Banner>
  );
};
