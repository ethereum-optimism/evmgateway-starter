# OP-Goerli Passport NFT (evmgateway example app)

<img width="299" alt="Screenshot 2023-11-07 at 11 52 37 PM" src="https://github.com/ethereum-optimism/evmgateway-starter/assets/9677071/02e9e4b3-f427-432e-b355-3351d011e0ba">


This is an example app that uses Ethereum Name Service (ENS)'s [evmgateway](https://github.com/ensdomains/evmgateway). 

Check it out at https://evmgateway-starter.vercel.app/

## What is OP-Goerli Passport NFT

The Passport NFT is as non-transferrable NFT on L1 (Goerli) that dynamically updates based on some of the owner's actions on L2 (OP Goerli). The NFT's `tokenURI` function performs two subsequent CCIP-Reads, and returns a svg string that encodes the read results.

## What is [evmgateway](https://github.com/ensdomains/evmgateway)?

EVM Gateway is a [CCIP-Read](https://eips.ethereum.org/EIPS/eip-3668) gateway that allows L1 smart contracts to fetch and verify state from L2s. Read more about it [here](https://github.com/ensdomains/evmgateway#evm-ccip-read-gateway).

## Who is this for?

- Hackers hacking on [evmgateway](https://github.com/ensdomains/evmgateway)
- Hackers interested in learning more about how an OP Stack chain works
- Hackers interested in learning more about how CCIP-Read works

## How does it work?

Check out the contract [here](https://github.com/ethereum-optimism/evmgateway-starter/blob/main/contracts/src/L1PassportNFT.sol)

- `L2TestCoin` is deployed on OP Goerli
- `L2TestNFT` is deployed on OP Goerli
- `L1PassportNFT` is deployed on Goerli

1. `tokenURI` function on the `L1PassportNFT` contract performs a CCIP-Read on the `L2TestCoin`'s `totalSupply` and `balanceOf` storage slots for the current owner of the NFT.
2. When the CCIP-Read in step 1 succeeds, `L1PassportNFT`'s `tokenURIFetchL2TestCoinBalanceCallback` is called
3. `tokenURIFetchL2TestCoinBalanceCallback` performs another CCIP-Read on `L2TestNFT`'s `_balanceOf`
4. When the CCIP-Read in step 3 succeeds, `L1PassportNFT`'s `tokenURIFetchL2TestNFTBalanceCallback` is called
5. `tokenURIFetchL2TestNFTBalanceCallback` takes the fetch results from the last 2 CCIP-Read calls, and then generates an svg string that displays the user's `L2TestCoin` and `L2TestNFT` balance.

## Deployments

### OP-Gateway and OP-Verifier deployments

The following are deployed versions of the [op-gateway](https://github.com/ensdomains/evmgateway/tree/main/op-gateway) with `delay = 0` and their corresponding [op-verifier](https://github.com/ensdomains/evmgateway/tree/main/op-verifier) contracts

| **chain**   | **op-gateway service**                                                  | op-verifier contract (on Goerli)                                                                                             |
| ----------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| OP Goerli   | https://op-goerli.op-gateway.transientdomain.xyz/{sender}/{data}.json   | [0xe58448bfc2fa097953e800e0af0b0a5257ecc4b1](https://goerli.etherscan.io/address/0xe58448bfc2fa097953e800e0af0b0a5257ecc4b1) |
| Base Goerli | https://base-goerli.op-gateway.transientdomain.xyz/{sender}/{data}.json | [0x7e2f9c4a1467e8a41e1e8283ba3ba72e3d92f6b8](https://goerli.etherscan.io/address/0x7e2f9c4a1467e8a41e1e8283ba3ba72e3d92f6b8) |

### Contract deployments

| **contract**  | **chain** | **address**                                                                                                                           |
| ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| L1PassportNFT | Goerli    | [0x0e24f4af1d5cd7fac0a96649511a15439d7e0c04](https://goerli.etherscan.io/address/0x0e24f4af1d5cd7fac0a96649511a15439d7e0c04)          |
| L2TestNFT     | OP Goerli | [0x22299910e573ecd436f4987c75f093894904d107](https://goerli-optimism.etherscan.io/address/0x22299910e573ecd436f4987c75f093894904d107) |
| L2TestCoin    | OP Goerli | [0x5a81f1f4d30f4153150848c31fabd0311946ed72](https://goerli-optimism.etherscan.io/address/0x5a81f1f4d30f4153150848c31fabd0311946ed72) |

## Local development

### Set up environment

#### Fork the repo

```sh
git clone https://github.com/ethereum-optimism/evmgateway-starter.git
```

```sh
cd evmgateway-starter
```


#### Specify .env

1. Copy `.env.example` to `.env`.

   ```sh
   cp .env.example .env
   ```

2. Edit your `.env` to specify the environment variables.

   - `VITE_RPC_URL_GOERLI`: HTTP RPC URL for Goerli

   - `VITE_RPC_URL_OP_GOERLI`: HTTP RPC URL for OP-Goerli

   - `VITE_WALLETCONNECT_PROJECT_ID`: WalletConnect v2 requires a project ID. You can obtain it from your WC dashboard: https://cloud.walletconnect.com/sign-in

#### Start the application

1. Install the necessary node packages:

   ```sh
   npm install
   ```

2. Start the frontend with `npm run dev`

   ```sh
   npm run dev
   ```

3. Open [localhost:5173](http://localhost:5173) in your browser.

### Deploying Contracts

#### Devnet vs. Testnet

Using a testnet is recommended. You can use the existing deployment for `op-verifier` contract and the `op-gateway` service on Goerli (listed above).

For a local development environment, you will need to do the following

- run an [Optimism Devnet](https://community.optimism.io/docs/developers/build/dev-node/)
- run an [op-gateway service](https://github.com/ensdomains/evmgateway/tree/main/op-gateway) against the devnet
- deploy [op-verifier](https://github.com/ensdomains/evmgateway/tree/main/op-verifier) contract on the devnet that uses the op-gateway service

#### Install Foundry

You will need to install [Foundry](https://book.getfoundry.sh/getting-started/installation) to build your smart contracts.

1. Run the following command:

   ```sh
   curl -L https://foundry.paradigm.xyz | bash
   ```

1. Source your environment as requested by Foundry.

1. Run `foundryup`.

#### Get an Etherscan key

1. Register for [Etherscan](https://explorer.optimism.io/register).
   Add the api key to `ETHERSCAN_API_KEY_GOERLI` in your `.env` file

2. Register for [Etherscan on Optimism](https://explorer.optimism.io/register).
   This account is different from your normal Etherscan account. Add this api key to `ETHERSCAN_API_KEY_OP_GOERLI` in your `.env` file

#### Deploy contracts

1. Deploy the `L2TestCoin` contract on OP Goerli

   ```sh
   npm run deploy:l2-test-coin
   ```

1. Deploy the `L2TestNFT` contract on OP Goerli

   ```sh
   npm run deploy:l2-test-nft
   ```

1. Update the `VITE_L2TESTNFT_CONTRACT_ADDRESS_OP_GOERLI` and `VITE_L2TESTCOIN_CONTRACT_ADDRESS_OP_GOERLI` with the addresses of the newly deployed contracts. This will be used as inputs for the `L1PassportNFT` contract

1. Deploy the `L1PassportNFT` contract on Goerli
   ```sh
   npm run deploy:l1-passport-nft
   ```


## Built using
- [thorin (ENS Design System)](https://thorin.ens.domains/)
- [wagmi](https://wagmi.sh/)
- [rainbowkit](https://www.rainbowkit.com/)
- [vite](https://vitejs.dev/)
- [foundry](https://getfoundry.sh/)
