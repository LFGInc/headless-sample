import { ethers } from "ethers";
import { Gateway, LfgWallet } from "./lib";
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("PRIVATE_KEY is not set");
}
const lfgWallet = LfgWallet.newFromPrivateKey(privateKey);
lfgWallet.log();

export enum AllowanceType {
  Use = 0,
  Lock = 1,
  // Note: We may want to remove this in the future, as Spend is redundant with transfer allowance
  Spend = 2,
  Transfer = 3,
  Mint = 4,
  Swap = 5,
  Burn = 6,
}

type TokenInstance = {
  collection: string;
  category: string;
  type: string;
  additionalKey: string;
};

const galaTokenInstance: TokenInstance = {
  collection: "GALA",
  category: "Unit",
  type: "none",
  additionalKey: "none",
};

const customTokenInstance: TokenInstance = {
  category: "LFGWallet",
  collection: "LFGWallet",
  type: "none",
  additionalKey: "none",
};

const customNFTInstance: TokenInstance = {
  additionalKey: "none",
  category: "LFGWalletNFT",
  collection: "LFGWalletNFT",
  type: "none",
};

async function main() {
  // await createTokenClass();
  // await grantAllowance();
  // await mintToken();
  await transferNFT();
}

const transferNFT = async () => {
  const response = await lfgWallet.request({
    gateway: Gateway.ExtHeadless,
    channel: "asset",
    contract: "token-contract",
    function: "TransferToken",
    payload: {
      uniqueKey: new Date().getTime().toString(),
      from: lfgWallet.ethUserId(),
      to: `eth|${ethers.getAddress(
        "0x64c18b1553ea5b91dc4218635c8d678ab8cff492"
      )}`,
      tokenInstance: {
        ...customNFTInstance,
        instance: "95",
      },
      quantity: "2",
    },
    sign: true,
  });
};

const transferToken = async () => {
  const reponse = await lfgWallet.request({
    gateway: Gateway.ExtHeadless,
    channel: "asset",
    contract: "token-contract",
    function: "TransferToken",
    payload: {
      uniqueKey: new Date().getTime().toString(),
      from: lfgWallet.ethUserId(),
      to: `eth|${ethers
        .getAddress("0xa66b7911edd72e6c86c7c5a55689c8993d18c459")
        .replace("0x", "")}`,
      tokenInstance: galaTokenInstance,
      quantity: "100",
    },
    sign: true,
  });
};

const fetchBalance = async () => {
  const owner = lfgWallet.ethUserId();
  const response = (await lfgWallet.request({
    gateway: Gateway.ExtHeadless,
    channel: "asset",
    contract: "token-contract",
    function: "FetchBalances",
    payload: {
      owner,
    },
  })) as any;

  return response.Data;
};

/// How to mint the gala token
const createTokenClass = async () => {
  const nftData = {
    isNonFungible: true,
    rarity: "rare", // Optional, for NFTs
  };
  const tokenData = {
    authorities: [lfgWallet.ethUserId()], // Replace with actual authority ID
    decimals: 0, // Defaults to 0 for NFTs
    description: "LFG Wallet NFT",
    ...nftData, // Optional, for NFTs
    image: "https://avatars.githubusercontent.com/t/10094271?s=116&v=4", // URL of the token's image
    // isNonFungible: true, // Set true for NFT
    maxCapacity: "123456789",
    maxSupply: "123456789", // Defaults to "Infinity"
    metadataAddress: "ipfs://QmXo1z832Y4Q79qWnYb9z31y88T2VZJYXjFm5nHq1p", // Optional
    name: "LFG Wallet NFT",
    symbol: "LFGNFT",
    network: "GC", // Default
    tokenClass: {
      ...customNFTInstance,
      signing: "ETH",
    },
    totalBurned: "0", // Defaults to "0"
    totalMintAllowance: "123456789",
    totalSupply: "0", // Defaults to "0"
    uniqueKey: new Date().getTime().toString(), // Unique identifier for the token
  };

  const response = await lfgWallet.request({
    gateway: Gateway.ExtHeadless,
    channel: "asset",
    contract: "token-contract",
    function: "CreateTokenClass",
    payload: tokenData,
    sign: true,
  });

  console.log({ response });

  return response;
};

const grantAllowance = async () => {
  const payload = {
    allowanceType: AllowanceType.Mint,
    tokenInstance: {
      ...customNFTInstance,
      instance: "0",
    },
    quantities: [
      {
        user: "eth|8B73C6c3F60ac6F45bb6A7D2A0080AF829c76e43",
        quantity: "100",
      },
    ],
    uses: "10",
  };

  const signedPayload = await lfgWallet.sign(payload);

  const response = await fetch(
    `${Gateway.ExtHeadless}/asset/token-contract/GrantAllowance`,
    {
      method: "POST",
      body: JSON.stringify(signedPayload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  console.log({ grantAllowance: data.Data });
};

const mintToken = async () => {
  const payload = {
    uniqueKey: new Date().getTime().toString(),
    owner: lfgWallet.ethUserId(),
    quantity: "100",
    tokenClass: customNFTInstance,
  };

  const response = (await lfgWallet.request({
    gateway: Gateway.ExtHeadless,
    channel: "asset",
    contract: "token-contract",
    function: "MintToken",
    payload,
    sign: true,
  })) as any;

  console.log({ mintToken: response.Data });
};

main();

// const compressedPubKey = Buffer.from(
//   "0230ba5a30486d9322b1e59c2add1f6c884869c69da4c627642b01b75eeda10275",
//   "hex"
// );
// Encode to Base64-URL
// const encodedPubKey = compressedPubKey.toString("base64url");
// console.log({ encodedPubKey });
