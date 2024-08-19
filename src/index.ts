import { debug, Gateway, LfgWallet } from "./lib";

// NOTE: The function below is used for creating a new account
// Just use it to generate and register an account,
// then use function "main" to test other stuffs
//
// async function createNewWallet() {
//   const lfgWallet = LfgWallet.newRandom()
//   lfgWallet.log()
//   await debug("Register headless wallet:", lfgWallet.registerHeadless());
// }
// createNewWallet()

async function main() {
  const lfgWallet = LfgWallet.newRandom();

  // const privateKey =
  //   "0x230315a4a7639cc226b425bd01f4544ca305c77c0f0c8d07f6b1d135778cf862";
  // const lfgWallet = LfgWallet.newFromPrivateKey(privateKey);
  lfgWallet.log();

  console.info("\n========================================\n");

  await debug("Register headless wallet", lfgWallet.registerHeadless());

  await debug(
    "Get public key from Swap gateway",
    lfgWallet.request({
      gateway: Gateway.Ext,
      channel: "asset",
      contract: "public-key-contract",
      function: "GetMyProfile",
      payload: {},
      sign: true,
    }),
  );

  await debug(
    "Get public key from Swap gateway",
    lfgWallet.request({
      gateway: Gateway.Galaswap,
      channel: "asset",
      contract: "public-key-contract",
      function: "GetPublicKey",
      payload: { user: lfgWallet.ethUserId() },
    }),
  );

  // await debug("Get public key from Int gateway",
  //   lfgWallet.request({
  //     gateway: Gateway.Int,
  //     channel: "asset",
  //     contract: "public-key-contract",
  //     function: "GetPublicKey",
  //     payload: { user: lfgWallet.ethUserId() }
  //   }));

  // await debug(
  //   "Get balance from Swap gateway",
  //   lfgWallet.request({
  //     gateway: Gateway.Galaswap,
  //     channel: "asset",
  //     contract: "token-contract",
  //     function: "FetchBalances",
  //     payload: { user: lfgWallet.ethUserId() },
  //   }),
  // );

  // await debug(
  //   "Get public key from Ext gateway",
  //   lfgWallet.request({
  //     gateway: Gateway.Ext,
  //     channel: "asset",
  //     contract: "public-key-contract",
  //     function: "GetPublicKey",
  //     payload: { user: lfgWallet.ethUserId() },
  //   }),
  // );

  // await debug(
  //   "Register Eth user with Ext gateway",
  //   lfgWallet.request({
  //     gateway: Gateway.Ext,
  //     channel: "asset",
  //     contract: "public-key-contract",
  //     function: "RegisterEthUser",
  //     payload: { publicKey: lfgWallet.publicKey() },
  //   }),
  // );
}

main();
