import { Button, Tag } from "@ensdomains/thorin";
import { useNetwork, useSwitchNetwork } from "wagmi";

export const NetworkConnectedTag = ({ chainId }: { chainId: number }) => {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  if (!chain || chain.id !== chainId) {
    return (
      <Button
        shape="rounded"
        width="36"
        size="small"
        disabled={!switchNetwork}
        onClick={() => switchNetwork?.(chainId)}
      >
        Switch network
      </Button>
    );
  }

  return (
    <Tag size="medium" colorStyle="greenPrimary">
      Network connected to wallet
    </Tag>
  );
};
