import { Button, Card, Typography } from "@ensdomains/thorin";
import { optimismGoerli } from "wagmi/chains";
import {
  useAccount,
  useContractReads,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { L2TestNFTAbi } from "../constants/L2TestNFTAbi";
import { TransactionReceipt } from "viem";
import { useState } from "react";
import { L2TransactionList } from "./L2TransactionList";
import { SwitchNetworkButton } from "./SwitchNetworkButton";

const MintNFTButton = ({
  onSuccess,
}: {
  onSuccess: (transactionReceipt: TransactionReceipt) => void;
}) => {
  const { address } = useAccount();
  const { config } = usePrepareContractWrite({
    address: import.meta.env.VITE_L2TESTNFT_CONTRACT_ADDRESS_OP_GOERLI,
    abi: L2TestNFTAbi,
    chainId: optimismGoerli.id,
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
      chainId: optimismGoerli.id,
      confirmations: 2,
      onSuccess: (receipt) => {
        onSuccess(receipt);
      },
    },
  );

  const { chain } = useNetwork();
  if (chain?.id !== optimismGoerli.id) {
    return <SwitchNetworkButton chain={optimismGoerli} />;
  }

  const isDisabled =
    !write || isTransactionSendLoading || isTransactionConfirmationLoading;
  const isLoading =
    isTransactionSendLoading || isTransactionConfirmationLoading;

  return (
    <Button
      disabled={isDisabled}
      loading={isLoading}
      onClick={() => {
        write?.();
      }}
    >
      Mint L2TestNFT
    </Button>
  );
};

export const L2TestNFTCard = () => {
  const { address } = useAccount();
  const [latestTransactions, setLatestTransactions] = useState<
    TransactionReceipt[]
  >([]);

  const { data = [], refetch } = useContractReads({
    contracts: [
      {
        abi: L2TestNFTAbi,
        address: import.meta.env.VITE_L2TESTNFT_CONTRACT_ADDRESS_OP_GOERLI,
        functionName: "balanceOf",
        args: [address!],
        chainId: optimismGoerli.id,
      },
      {
        abi: L2TestNFTAbi,
        address: import.meta.env.VITE_L2TESTNFT_CONTRACT_ADDRESS_OP_GOERLI,
        functionName: "currentTokenId",
        chainId: optimismGoerli.id,
      },
    ],
    enabled: !!address,
    allowFailure: false,
  });

  const [userNFTBalance, currentTokenId] = data;
  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography fontVariant="headingFour">L2TestNFT</Typography>
      <Typography fontVariant="body">
        Wallet balance:{" "}
        {userNFTBalance !== undefined
          ? userNFTBalance.toString()
          : "Loading..."}
      </Typography>
      <Typography fontVariant="body">
        Total minted:{" "}
        {currentTokenId !== undefined
          ? currentTokenId.toString()
          : "Loading..."}
      </Typography>
      <MintNFTButton
        onSuccess={(transactionReceipt) => {
          setLatestTransactions((latestTransactions) => [
            transactionReceipt,
            ...latestTransactions,
          ]);
          refetch();
        }}
      />
      <L2TransactionList transactionReceipts={latestTransactions} />
    </Card>
  );
};
