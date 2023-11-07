import { Typography, UpRightArrowSVG } from "@ensdomains/thorin";
import { Hex } from "viem";
import { Chain } from "wagmi";

const truncateHash = (hash: Hex) => {
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
};

export const TxBlockExplorerLink = ({
  hash,
  chain,
}: {
  hash: Hex;
  chain: Chain;
}) => {
  return (
    <a
      href={`${chain.blockExplorers!.default.url}/tx/${hash}`}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Typography font="mono" fontVariant="small">
        {truncateHash(hash)}
      </Typography>

      <UpRightArrowSVG />
    </a>
  );
};
