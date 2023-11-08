import { useBlockNumber } from "wagmi";
import { goerli, optimismGoerli } from "wagmi/chains";
import { Banner, Spinner } from "@ensdomains/thorin";
import { useState } from "react";
import { useLatestAvailableL2BlockNumberOnL1 } from "../lib/useLatestAvailableL2BlockNumberOnL1";
import { L2OutputOracleAddress } from "../constants/L2OutputOracleAddress";

const LastUpdatedAt = ({ date }: { date?: Date }) => {
  if (!date) {
    return null;
  }

  return <div>last submitted at {date.toLocaleTimeString()}</div>;
};

const LatestL2OutputOracleContent = () => {
  const [latestL2OutputProposedDate, setLatestL2OutputProposedDate] =
    useState<Date>();

  const { data: latestL2Block, isLoading: isLatestL2BlockLoading } =
    useBlockNumber({
      watch: true,
      chainId: optimismGoerli.id,
    });

  const { data: latestL2BlockOnL1, isLoading: isLatestL2BlockOnL1Loading } =
    useLatestAvailableL2BlockNumberOnL1((latestL1Timestamp) => {
      if (latestL1Timestamp) {
        setLatestL2OutputProposedDate(
          new Date(Number(latestL1Timestamp) * 1000),
        );
      }
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
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Spinner />
      {latestL2BlockOnL1.toString()} ({numBlocksBehind.toString()} blocks
      behind)
      {/* <LastUpdatedAt date={latestL2OutputProposedDate} /> */}
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
      href={`${goerli.blockExplorers.default.url}/address/${L2OutputOracleAddress}`}
    >
      <LatestL2OutputOracleContent />
    </Banner>
  );
};
