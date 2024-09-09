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
  //   "0xe02a9d0bcf0d14ab1b254d62c199768e812c5cb98c01e879089993ea67fcb6c2";
  // const lfgWallet = LfgWallet.newFromPrivateKey(privateKey);
  lfgWallet.log();

  console.info("\n========================================\n");

  await debug("Register lfg", lfgWallet.registerLfg());
  await debug(
    "Get public key from Ext gateway",
    lfgWallet.request({
      gateway: Gateway.ExtHeadless,
      channel: "lfg",
      contract: "public-key-contract",
      function: "GetMyProfile",
      payload: {},
      sign: true,
    }),
  );

  await debug("Register headless wallet", lfgWallet.registerHeadless());
  await debug(
    "Get public key from Ext gateway",
    lfgWallet.request({
      gateway: Gateway.ExtHeadless,
      channel: "asset",
      contract: "public-key-contract",
      function: "GetMyProfile",
      payload: {},
      sign: true,
    }),
  );


  // await debug(
  //   "Get public key from Ext gateway",
  //   lfgWallet.request({
  //     gateway: Gateway.ExtHeadless,
  //     channel: "lfg",
  //     contract: "public-key-contract",
  //     function: "GetPublicKey",
  //     payload: { user: lfgWallet.normalUserId() },
  //   }),
  // );
  //
  // await debug(
  //   "Get balane from Ext gateway",
  //   lfgWallet.request({
  //     gateway: Gateway.ExtHeadless,
  //     channel: "asset",
  //     contract: "token-contract",
  //     function: "FetchBalances",
  //     payload: { owner: lfgWallet.ethUserId() },
  //   }),
  // );
  //
  // await debug(
  //   "Get public key from Ext gateway",
  //   lfgWallet.request({
  //     gateway: Gateway.ExtHeadless,
  //     channel: "lfg",
  //     contract: "public-key-contract",
  //     function: "GetMyProfile",
  //     payload: {},
  //     sign: true,
  //   }),
  // );

  await debug(
    "Get public key from Ext gateway",
    lfgWallet.request({
      gateway: Gateway.ExtHeadless,
      channel: "lfg",
      contract: "lfg-contract",
      function: "ProjectCreate",
      payload: {
        "distribution": "QmWn8aQhwUFefPqBdm4W3s2ceve2CJ6MZMyqDnzeHLBCFt",
        "name": "Tinguyen 03",
        "description": "No description. Test only",
        "image": "https://ipfs-ops-api.rep.run/ipfs/QmeGMLDnK4USHuyPPYYTWXfVry8tj3gSaFY8PyMhZyv1pD",
        "version": "0.0.1"
      },
      sign: true,
    }),
  );
}

main();
