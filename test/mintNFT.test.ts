import { describe, test } from "bun:test";
import { Gateway, LfgWallet } from "../src/lib";
import { AllowanceType, TokenInstance } from "../src/lib/token";
import util from "node:util";

// key = GCTILFGWalletTokenerc20none
// -> network + <?> + collection + category + type + additionalKey

const timeout = 20_000;
const baseTokenConfig = {
  // List of chain user identifiers who should become token authorities. Only token authorities can give mint allowances. By default the calling user becomes a single token authority.
  //   authorities: ["eth|8B73C6c3F60ac6F45bb6A7D2A0080AF829c76e43"], //

  //   maxCapacity: "123456789", // Defaults to "Infinity"
  maxSupply: "1000000", // Defaults to "Infinity"

  //   network: "GC", // Default
  //   totalBurned: "0", // Defaults to "0"
  //   totalMintAllowance: "123456789",
  //   totalSupply: "0", // Defaults to "0"
  description: "LFG Wallet Collection",
  image: "https://avatars.githubusercontent.com/t/10094271?s=116&v=4",
  metadataAddress: "ipfs://QmXo1z832Y4Q79qWnYb9z31y88T2VZJYXjFm5nHq1p", // Optional
  name: "LFG Wallet",
  symbol: "lfgs",
  uniqueKey: new Date().getTime().toString(),
};

describe("deploy-token", () => {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY is not set");
  }

  const lfgWallet = LfgWallet.newFromPrivateKey(privateKey);
  lfgWallet.log();

  const tokenClass: TokenInstance = {
    category: "WalletToken",
    collection: "LFG",
    type: "baseNFT",
    additionalKey: "none",
  };

  const newToken = {
    ...baseTokenConfig,
    tokenClass: tokenClass,
    isNonFungible: true,
  };

  test(
    "create-token-class",
    async () => {
      const response = await lfgWallet.request({
        gateway: Gateway.ExtHeadless,
        channel: "asset",
        contract: "token-contract",
        function: "CreateTokenClass",
        payload: newToken,
        sign: true,
      });

      logJson(response);
    },
    {
      timeout,
    }
  );

  test(
    "grant-allowance",
    async () => {
      const payload = {
        allowanceType: AllowanceType.Mint,
        tokenInstance: {
          ...tokenClass,
          // Token instance of token which the allowance concerns. In case of fungible tokens, tokenInstance.instance field should be set to 0. A full or partial key of a TokenInstance, for querying or actioning one or more instances of a token.
          instance: "0",
        },
        quantities: [
          {
            user: lfgWallet.ethUserId(),
            quantity: "2000",
          },
        ],
        uses: "10", // number of times the allowance can be used
      };

      const response = await lfgWallet.request({
        gateway: Gateway.ExtHeadless,
        channel: "asset",
        contract: "token-contract",
        function: "GrantAllowance",
        payload: payload,
        sign: true,
      });

      logJson(response);
    },
    {
      timeout,
    }
  );

  test(
    "mint",
    async () => {
      const payload = {
        uniqueKey: new Date().getTime().toString(),
        owner: lfgWallet.ethUserId(),
        quantity: "12",
        tokenClass: tokenClass,
      };

      const response = (await lfgWallet.request({
        gateway: Gateway.ExtHeadless,
        channel: "asset",
        contract: "token-contract",
        function: "MintToken",
        payload,
        sign: true,
      })) as any;

      logJson(response);
    },
    {
      timeout,
    }
  );
});

const logJson = (json: any) => {
  console.log(
    util.inspect(json, { showHidden: false, depth: null, colors: true })
  );
};
