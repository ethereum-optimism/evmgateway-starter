import { Button, Card, Typography } from "@ensdomains/thorin";
import { optimismGoerli } from "wagmi/chains";
import {
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { L2TestCoinAbi } from "../constants/L2TestCoinAbi";
import { useState } from "react";
import { TransactionReceipt } from "viem";
import { L2TransactionList } from "./L2TransactionList";

const MintCoinButton = ({
  onSuccess,
}: {
  onSuccess: (transactionReceipt: TransactionReceipt) => void;
}) => {
  const { address } = useAccount();
  const { config } = usePrepareContractWrite({
    address: "0x5a81f1f4d30f4153150848c31fabd0311946ed72",
    abi: L2TestCoinAbi,
    chainId: optimismGoerli.id,
    functionName: "mintTo",
    args: [address!, 1000n],
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
      Mint L2TestCoin (1000)
    </Button>
  );
};

export const L2TestCoinCard = () => {
  const [latestTransactions, setLatestTransactions] = useState<
    TransactionReceipt[]
  >([]);

  const { address } = useAccount();
  const {
    data = [],
    isLoading,
    refetch,
  } = useContractReads({
    contracts: [
      {
        abi: L2TestCoinAbi,
        address: "0x5a81f1f4d30f4153150848c31fabd0311946ed72",
        functionName: "balanceOf",
        args: [address!],
        chainId: optimismGoerli.id,
      },
      {
        abi: L2TestCoinAbi,
        address: "0x5a81f1f4d30f4153150848c31fabd0311946ed72",
        functionName: "totalSupply",
        chainId: optimismGoerli.id,
      },
    ],
    enabled: !!address,
    allowFailure: false,
  });

  const [userCoinBalance, totalSupply] = data;

  return (
    <Card style={{}}>
      <Typography fontVariant="headingFour">L2TestCoin</Typography>
      <Typography fontVariant="body">
        Wallet balance:{" "}
        {userCoinBalance !== undefined
          ? userCoinBalance.toString()
          : "Loading..."}
      </Typography>
      <Typography fontVariant="body">
        Total supply:{" "}
        {totalSupply !== undefined ? totalSupply.toString() : "Loading..."}
      </Typography>

      <MintCoinButton
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
