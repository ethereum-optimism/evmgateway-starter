import { Viewer } from "./Viewer";
import { goerli } from "wagmi/chains";
import { ChainPanelCard } from "./ChainPanelCard";
import { LatestL2OutputOracleDisplay } from "./LatestL2OutputOracleDisplay";

export const L1Panel = () => {
  return (
    <ChainPanelCard
      chain={goerli}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LatestL2OutputOracleDisplay />
      <Viewer />
    </ChainPanelCard>
  );
};
