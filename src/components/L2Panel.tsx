import { Banner, Button, Card, Heading } from "@ensdomains/thorin";
import { ChainPanelCard } from "./ChainPanelCard";
import { optimismGoerli } from "wagmi/chains";
import { useBlockNumber } from "wagmi";

const BlockNumberDisplay = () => {
  const { data } = useBlockNumber({ watch: true, chainId: optimismGoerli.id });

  return (
    <Banner title="Latest OP Goerli block">
      {data ? data.toString() : "Loading..."}
    </Banner>
  );
};

export const L2Panel = () => {
  return (
    <ChainPanelCard
      chain={optimismGoerli}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <BlockNumberDisplay />
      <Button>Mint L2TestNFT</Button>
      <Button>Mint 10 L2TestCoin</Button>
    </ChainPanelCard>
  );
};
