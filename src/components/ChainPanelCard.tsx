import { Card, Heading } from "@ensdomains/thorin";
import { Chain } from "wagmi";
import { NetworkConnectedTag } from "./NetworkConnectedTag";

export const ChainPanelCard = ({
  chain,
  children,
  style = {},
}: {
  chain: Chain;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Heading level="2">{chain.name}</Heading>
        <NetworkConnectedTag chainId={chain.id} />
      </div>
      {children}
    </div>
  );
};
