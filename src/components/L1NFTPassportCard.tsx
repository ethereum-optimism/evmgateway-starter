import { Button, Card, Typography } from "@ensdomains/thorin";
import { goerli, optimismGoerli } from "wagmi/chains";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { TxBlockExplorerLink } from "./TxBlockExplorerLink";
import { L1PassportNFTAbi } from "../constants/L1PassportNFTAbi";
import { L1NFTPassportViewer } from "./L1NFTPassportViewer";
import { hexToBigInt } from "viem";
import { L2OutputOracleAbi } from "../constants/L2OutputOracleAbi";

const MintL1PassportNFTButton = ({ onSuccess }: { onSuccess: () => void }) => {
  const { address } = useAccount();
  const { config } = usePrepareContractWrite({
    address: "0x0e24f4af1d5cd7fac0a96649511a15439d7e0c04",
    abi: L1PassportNFTAbi,
    chainId: goerli.id,
    functionName: "mintTo",
    args: [address!],
    enabled: !!address,
  });
  const {
    data,
    write,
    isLoading: isTransactionSendLoading,
  } = useContractWrite(config);
  const { isLoading: isTransactionConfirmationLoading } = useWaitForTransaction(
    {
      hash: data?.hash,
      chainId: goerli.id,
      confirmations: 2,
      onSuccess: () => {
        onSuccess();
      },
    },
  );

  const isDisabled =
    !write || isTransactionSendLoading || isTransactionConfirmationLoading;
  const isLoading =
    isTransactionSendLoading || isTransactionConfirmationLoading;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Button
        disabled={isDisabled}
        loading={isLoading}
        onClick={() => {
          write?.();
        }}
      >
        Mint L1PassportNFT
      </Button>
      {data?.hash && (
        <div
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <TxBlockExplorerLink hash={data.hash} chain={goerli} />
        </div>
      )}
    </div>
  );
};

export const L1NFTPassportCard = () => {
  const { address } = useAccount();
  const {
    data: balanceOf,
    isLoading: isBalanceOfLoading,
    refetch: refetchBalanceOf,
  } = useContractRead({
    address: "0x0e24f4af1d5cd7fac0a96649511a15439d7e0c04",
    abi: L1PassportNFTAbi,
    chainId: goerli.id,
    functionName: "balanceOf",
    args: [address!],
    enabled: !!address,
  });

  const {
    data: tokenUri,
    isFetching,
    refetch: refetchTokenUri,
  } = useContractRead({
    address: "0x0e24f4af1d5cd7fac0a96649511a15439d7e0c04",
    chainId: goerli.id,
    abi: L1PassportNFTAbi,
    functionName: "tokenURI",
    args: [hexToBigInt(address!, { size: 32 })],
    enabled: !!address,
  });

  useContractEvent({
    abi: L2OutputOracleAbi,
    address: "0xE6Dfba0953616Bacab0c9A8ecb3a9BBa77FC15c0",
    eventName: "OutputProposed",
    chainId: goerli.id,
    listener: () => {
      // refetch the NFT tokenURI when a new output is proposed
      setTimeout(() => refetchTokenUri(), 1000);
    },
  });

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography fontVariant="headingFour">
        L1PassportNFT (Soulbound)
      </Typography>
      <Typography fontVariant="body">
        NFT will update dynamically as you mint new NFTs/Coins on{" "}
        {optimismGoerli.name}
      </Typography>
      {balanceOf === undefined || balanceOf === 0n ? (
        <MintL1PassportNFTButton onSuccess={() => refetchBalanceOf()} />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {tokenUri && <L1NFTPassportViewer tokenUri={tokenUri} />}
          </div>
          <div
            style={{
              height: 30,
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            {isFetching && "Refetching..."}
          </div>
        </div>
      )}
    </Card>
  );
};
