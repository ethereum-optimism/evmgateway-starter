import { goerli } from "wagmi/chains";
import { ChainPanel } from "./ChainPanel";
import { LatestL2OutputOracleDisplay } from "./LatestL2OutputOracleDisplay";
import { L1NFTPassportCard } from "./L1NFTPassportCard";

export const L1Panel = () => {
  return (
    <ChainPanel
      chain={goerli}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LatestL2OutputOracleDisplay />
      <div style={{ height: 1, backgroundColor: "#e0e0e0" }} />
      <L1NFTPassportCard />
    </ChainPanel>
  );
};
