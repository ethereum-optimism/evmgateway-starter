import { Button, Card, Typography } from "@ensdomains/thorin";
import { goerli, optimismGoerli } from "wagmi/chains";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { TxBlockExplorerLink } from "./TxBlockExplorerLink";
import { L1PassportNFTAbi } from "../constants/L1PassportNFTAbi";
import { L1NFTPassportViewer } from "./L1NFTPassportViewer";
import { hexToBigInt } from "viem";
import { L2OutputOracleAbi } from "../constants/L2OutputOracleAbi";
import { SwitchNetworkButton } from "./SwitchNetworkButton";
import { L2OutputOracleAddress } from "../constants/L2OutputOracleAddress";

const MintL1PassportNFTButton = ({ onSuccess }: { onSuccess: () => void }) => {
  const { address } = useAccount();
  const { config } = usePrepareContractWrite({
    address: import.meta.env.VITE_L1PASSPORTNFT_CONTRACT_ADDRESS_GOERLI,
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

  const { chain } = useNetwork();
  if (chain?.id !== goerli.id) {
    return <SwitchNetworkButton chain={goerli} />;
  }

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
    address: import.meta.env.VITE_L1PASSPORTNFT_CONTRACT_ADDRESS_GOERLI,
    abi: L1PassportNFTAbi,
    chainId: goerli.id,
    functionName: "balanceOf",
    args: [address!],
    enabled: !!address,
  });

  const {
    data: tokenUri,
    isFetching,
    isLoading,
    refetch: refetchTokenUri,
  } = useContractRead({
    address: import.meta.env.VITE_L1PASSPORTNFT_CONTRACT_ADDRESS_GOERLI,
    chainId: goerli.id,
    abi: L1PassportNFTAbi,
    functionName: "tokenURI",
    args: [hexToBigInt(address!, { size: 32 })],
    enabled: !!address,
  });

  useContractEvent({
    abi: L2OutputOracleAbi,
    address: L2OutputOracleAddress,
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
        L1PassportNFT (Non-transferrable)
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
            {(isFetching || isLoading) && "Refetching..."}
          </div>
        </div>
      )}
    </Card>
  );
};
