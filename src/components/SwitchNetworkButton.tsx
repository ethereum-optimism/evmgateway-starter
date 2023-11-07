import { Button } from "@ensdomains/thorin";
import { Chain, useSwitchNetwork } from "wagmi";

export const SwitchNetworkButton = ({ chain }: { chain: Chain }) => {
  const chainName = chain.name;
  const chainId = chain.id;

  const { switchNetwork, isLoading } = useSwitchNetwork();
  if (!isLoading && !switchNetwork) {
    return <div>Please switch the network to {chainName} on your wallet</div>;
  }
  return (
    <Button
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
      }}
      onClick={() => switchNetwork?.(chainId)}
      disabled={isLoading || !switchNetwork}
      loading={isLoading}
    >
      Switch to {chainName} to mint
    </Button>
  );
};
