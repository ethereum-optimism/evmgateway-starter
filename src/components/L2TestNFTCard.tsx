import { Button, Card, Toast, Typography } from "@ensdomains/thorin";
import { optimismGoerli } from "wagmi/chains";
import {
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { L2TestNFTAbi } from "../constants/L2TestNFTAbi";

const MintNFTButton = ({ onSuccess }: { onSuccess: () => void }) => {
  const { address } = useAccount();
  const { config } = usePrepareContractWrite({
    address: "0x22299910e573ecd436f4987c75f093894904d107",
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
      onSuccess,
    },
  );

  const isDisabled =
    !write || isTransactionSendLoading || isTransactionConfirmationLoading;
  const isLoading =
    isTransactionSendLoading || isTransactionConfirmationLoading;

  return (
    <>
      <Button
        disabled={isDisabled}
        loading={isLoading}
        onClick={() => write?.()}
        size="small"
      >
        Mint L2TestNFT
      </Button>
      {/* <Toast
        description="This is an example toast."
        open={getState("toast")}
        title="Example Toast"
        variant="desktop"
        onClose={() => setState("toast", false)}
      ></Toast> */}
    </>
  );
};

export const L2TestNFTCard = () => {
  const { address } = useAccount();
  const {
    data = [],
    isLoading,
    refetch,
  } = useContractReads({
    contracts: [
      {
        abi: L2TestNFTAbi,
        address: "0x22299910e573ecd436f4987c75f093894904d107",
        functionName: "balanceOf",
        args: [address!],
        chainId: optimismGoerli.id,
      },
      {
        abi: L2TestNFTAbi,
        address: "0x22299910e573ecd436f4987c75f093894904d107",
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
        onSuccess={() => {
          refetch();
        }}
      />
    </Card>
  );
};
