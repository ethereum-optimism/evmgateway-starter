import { Banner, Spinner } from "@ensdomains/thorin";
import { ChainPanel } from "./ChainPanel";
import { optimismGoerli } from "wagmi/chains";
import { useBlockNumber } from "wagmi";
import { L2TestNFTCard } from "./L2TestNFTCard";
import { L2TestCoinCard } from "./L2TestCoinCard";

const BlockNumberDisplay = () => {
  const { data } = useBlockNumber({ watch: true, chainId: optimismGoerli.id });

  return (
    <Banner
      title="Latest OP Goerli block"
      as="a"
      target="_blank"
      rel="noopener noreferrer"
      href={`${optimismGoerli.blockExplorers.default.url}/block/${data}`}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Spinner />
        {data ? data.toString() : "Loading..."}
      </div>
    </Banner>
  );
};

export const L2Panel = () => {
  return (
    <ChainPanel
      chain={optimismGoerli}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <BlockNumberDisplay />
      <div style={{ height: 1, backgroundColor: "#e0e0e0" }} />
      <L2TestNFTCard />
      <L2TestCoinCard />
    </ChainPanel>
  );
};
