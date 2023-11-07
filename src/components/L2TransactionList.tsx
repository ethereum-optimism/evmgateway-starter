import { TransactionReceipt } from "viem";
import { TxBlockExplorerLink } from "./TxBlockExplorerLink";
import { optimismGoerli } from "wagmi/chains";
import { useLatestAvailableL2BlockNumberOnL1 } from "../lib/useLatestAvailableL2BlockNumberOnL1";
import { Tag } from "@ensdomains/thorin";

const L2BlockAvailableOnL1Tag = ({
  transactionBlock,
  latestL2BlockOnL1,
}: {
  transactionBlock: bigint;
  latestL2BlockOnL1?: bigint;
}) => {
  if (!latestL2BlockOnL1 || latestL2BlockOnL1 < transactionBlock) {
    return (
      <Tag size="small" colorStyle="redPrimary">
        Unavailable on L1
      </Tag>
    );
  }
  return (
    <Tag size="small" colorStyle="greenPrimary">
      Available on L1
    </Tag>
  );
};

export const L2TransactionList = ({
  transactionReceipts,
}: {
  transactionReceipts: TransactionReceipt[];
}) => {
  const { data: latestL2BlockOnL1, isLoading: isLatestL2BlockOnL1Loading } =
    useLatestAvailableL2BlockNumberOnL1();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {transactionReceipts.map((transactionReceipt) => {
        const { blockNumber, transactionHash } = transactionReceipt;

        return (
          <div
            key={transactionHash}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "14px",
            }}
          >
            <TxBlockExplorerLink
              hash={transactionHash}
              chain={optimismGoerli}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{}}>Block #: {blockNumber.toString()}</div>

              <div
                style={{ width: 140, display: "flex", justifyContent: "end" }}
              >
                <L2BlockAvailableOnL1Tag
                  transactionBlock={blockNumber}
                  latestL2BlockOnL1={latestL2BlockOnL1}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
