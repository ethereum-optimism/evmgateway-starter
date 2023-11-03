import { Banner, Button, Card, Spinner, Typography } from "@ensdomains/thorin";
import { ChainPanelCard } from "./ChainPanelCard";
import { optimismGoerli } from "wagmi/chains";
import { useAccount, useBlockNumber, useContractReads } from "wagmi";
import { L2TestCoinAbi } from "../constants/L2TestCoinAbi";
import { L2TestNFTCard } from "./L2TestNFTCard";

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

const L2TestCoinSection = () => {
  const { address } = useAccount();
  const { data = [], isLoading } = useContractReads({
    contracts: [
      {
        abi: L2TestCoinAbi,
        address: "0x5a81f1f4d30f4153150848c31fabd0311946ed72",
        functionName: "balanceOf",
        args: [address!],
        chainId: optimismGoerli.id,
      },
      {
        abi: L2TestCoinAbi,
        address: "0x5a81f1f4d30f4153150848c31fabd0311946ed72",
        functionName: "totalSupply",
        chainId: optimismGoerli.id,
      },
    ],
    enabled: !!address,
    allowFailure: false,
  });

  const [userCoinBalance, totalSupply] = data;

  return (
    <Card style={{}}>
      <Typography fontVariant="headingFour">L2TestCoin</Typography>
      <Typography fontVariant="body">
        Wallet balance:{" "}
        {userCoinBalance !== undefined
          ? userCoinBalance.toString()
          : "Loading..."}
      </Typography>
      <Typography fontVariant="body">
        Total supply:{" "}
        {totalSupply !== undefined ? totalSupply.toString() : "Loading..."}
      </Typography>

      <Button size="small">Mint L2TestNFT</Button>
    </Card>
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
      <div style={{ height: 1, backgroundColor: "#e0e0e0" }} />
      <L2TestNFTCard />
      <L2TestCoinSection />
    </ChainPanelCard>
  );
};
