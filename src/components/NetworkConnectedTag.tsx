import { Tag } from "@ensdomains/thorin";
import { useNetwork } from "wagmi";

export const NetworkConnectedTag = ({ chainId }: { chainId: number }) => {
  const { chain } = useNetwork();

  if (!chain || chain.id !== chainId) {
    return null;
  }

  return (
    <Tag size="medium" colorStyle="greenPrimary">
      Network connected to wallet
    </Tag>
  );
};
