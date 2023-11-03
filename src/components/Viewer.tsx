import { useAccount, useContractRead, usePublicClient } from "wagmi";
import { L1ERC721TokenAbi } from "../constants/L1ERC721TokenAbi";
import { goerli } from "wagmi/chains";
import { useEffect } from "react";
import { TestL1Abi } from "../constants/TestL1Abi";
import {
  encodeErrorResult,
  getAbiItem,
  getFunctionSelector,
  getFunctionSignature,
} from "viem";
import { L2ERC721TokenAbiV2 } from "../constants/L2ERC721TokenAbiV2";
import { L2ERC721TokenAbiV3 } from "../constants/L2ERC721TokenAbiV3";
import { L1PassportNFTAbi } from "../constants/L1PassportNFTAbi";

function base64ToJson(base64String: string) {
  // Check for the data URI scheme and strip it off if present
  let prefix = "data:application/json;base64,";
  if (base64String.startsWith(prefix)) {
    base64String = base64String.substring(prefix.length);
  }

  // Decode the base64 string
  let jsonString = atob(base64String);

  // Parse the JSON string to get a JS object
  let jsonObject = JSON.parse(jsonString);

  return jsonObject;
}

function base64ToSvgString(base64String: string) {
  // Check for the data URI scheme and strip it off if present
  let prefix = "data:image/svg+xml;base64,";
  if (base64String.startsWith(prefix)) {
    base64String = base64String.substring(prefix.length);
  }

  // Decode the base64 string
  let jsonString = atob(base64String);

  return jsonString;
}

export const Viewer = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient({ chainId: goerli.id });

  const { data, isError, isLoading } = useContractRead({
    address: "0x261c8e7da3de16c5de19302f44193ebec643731e",
    chainId: goerli.id,
    abi: L1PassportNFTAbi,
    functionName: "tokenURI",
    args: [0n],
  });
  console.log(data);

  if (!data) {
    return <div>no data</div>;
  }

  const x = base64ToJson(data);
  const y = base64ToSvgString(x.image);
  console.log(y);
  return (
    <div>
      <img src={x.image} width="300" height="300" />
    </div>
  );
};
