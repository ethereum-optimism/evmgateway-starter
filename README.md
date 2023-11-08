# OP-Goerli Passport NFT (evmgateway example app)

This is an example app that uses Ethereum Name Service (ENS)'s [evmgateway](https://github.com/ensdomains/evmgateway).

## What is OP-Goerli Passport NFT

The Passport NFT is as non-transferrable NFT on L1 (Goerli) that dynamically updates based on some of the owner's actions on L2 (OP Goerli). The NFT's `tokenURI` function performs two subsequent CCIP-Reads, and returns a svg string that encodes the read results.

## What is [evmgateway](https://github.com/ensdomains/evmgateway)?

EVM Gateway is a [CCIP-Read](https://eips.ethereum.org/EIPS/eip-3668) gateway that allows L1 smart contracts to fetch and verify state from L2s. Read more about it [here](https://github.com/ensdomains/evmgateway#evm-ccip-read-gateway).

## Who is this for?

- Hackers hacking on [evmgateway](https://github.com/ensdomains/evmgateway)
- Hackers interested in learning more about how an OP Stack chain works
- Hackers interested in learning more about how CCIP-Read works

## How does it work?

Check out the contract here

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

## Getting Started

### Install Node

[See here](https://nodejs.org/en/download/).
Note that you need Node at a later version than 14.18.0, or 16 and above.
These instructions were verified with Node 18.

### Install Foundry

You will need to install [Foundry](https://book.getfoundry.sh/getting-started/installation) to build your smart contracts.

1. Run the following command:

   ```sh
   curl -L https://foundry.paradigm.xyz | bash
   ```

1. Source your environment as requested by Foundry.

1. Run `foundryup`.

</details>

## Set up environment

### Get an Etherscan key

1. Register for [Etherscan on Optimism](https://explorer.optimism.io/register).
   This account is different from your normal Etherscan account.

1. Go to [the API keys page](https://explorer.optimism.io/myapikey) and click **Add** to create a new API key.

### Specify .env

You will first need to set up your `.env` to tell Forge where to deploy your contract.

1. Copy `.env.example` to `.env`.

   ```sh
   cp .env.example .env
   ```

1. Edit your `.env` to specify the environment variables.

   - `ETHERSCAN_API_KEY`: Your Etherscan API Key.

   - `FORGE_RPC_URL`: The RPC URL of the network to which you deploy.
     If you use [Alchemy](https://github.com/ethereum-optimism/optimism-tutorial/tree/main/ecosystem/alchemy), your URL will look like this: `https://opt-goerli.g.alchemy.com/v2/<Alchemy API Key>`

   - `FORGE_PRIVATE_KEY`: The private key of the wallet you want to deploy from.

   - `VITE_WALLETCONNECT_PROJECT_ID`: WalletConnect v2 requires a project ID. You can obtain it from your WC dashboard: https://docs.walletconnect.com/2.0/web/web3wallet/installation#obtain-project-id

## Start the application

<img width="450" alt="starter-app-screenshot" src="https://user-images.githubusercontent.com/389705/225778318-4e6fb8c0-c5d7-4aea-9fc2-2efd17ca435c.png">

1. Clone/fork the optimism-starter repo

   ```sh
   git clone https://github.com/ethereum-optimism/optimism-starter.git
   ```

1. Install the necessary node packages:

   ```sh
   cd optimism-starter
   npm install
   ```

1. Start the frontend with `npm run dev`

   ```sh
   npm run dev
   ```

   If you get errors during this step, you might need to [update your Foundry to the latest version](#install-foundry).

1. Open [localhost:5173](http://localhost:5173) in your browser.

   Once the webpage has loaded, changes made to files inside the `src/` directory (e.g. `src/App.tsx`) will automatically update the webpage.

See below for general usage instructions or [FAQ](./FAQ.md) for answers to general questions such as:

- [Where to get goerli eth]().
- [How to deploy a public version of your app](./FAQ.md#how-do-i-deploy-this).

## Deploying Contracts

To deploy your contracts to a network, you can use Foundry's [Forge](https://book.getfoundry.sh/forge/) – a command-line tool to tests, build, and deploy your smart contracts.

You can read a more in-depth guide on using Forge to deploy a smart contract [here](https://book.getfoundry.sh/forge/deploying), but we have included a simple script in the `package.json` to get you started.

Below are the steps to deploying a smart contract to Ethereum Mainnet using Forge:

## Deploy contract

You can now deploy your contract!

```sh
npm run deploy
```

## Developing with Anvil (Optimism Mainnet Fork)

Let's combine the above sections and use Anvil alongside our development environment to use our contracts (`./contracts`) against an Optimism fork.

### Start dev server

Run the command:

```sh
npm run dev:foundry
```

This will:

- Start a vite dev server,
- Start the `@wagmi/cli` in [**watch mode**](https://wagmi.sh/cli/commands/generate#options) to listen to changes in our contracts, and instantly generate code,
- Start an Anvil instance (Goerli Optimism Fork) on an RPC URL.

### Deploy our contract to Anvil

Now that we have an Anvil instance up and running, let's deploy our smart contract to the Anvil network:

```sh
npm run deploy:anvil
```

## Start developing

Now that your contract has been deployed to Anvil, you can start playing around with your contract straight from the web interface!

Head to [localhost:5173](http://localhost:5173) in your browser, connect your wallet, and try increment a counter on the Foundry chain. Use the generated code in `src/generated.ts` to do it and follow the [Attestooooor](https://github.com/ethereum-optimism/optimism-starter/blob/main/src/components/Attestoooooor.tsx) component as an example

> Tip: If you import an Anvil private key into your browser wallet (MetaMask, Coinbase Wallet, etc) – you will have 10,000 ETH to play with 😎. The private key is found in the terminal under "Private Keys" when you start up an Anvil instance with `npm run dev:foundry`.
