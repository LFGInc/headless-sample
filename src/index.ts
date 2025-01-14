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
  // const lfgWallet = LfgWallet.newRandom();

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY is not set");
  }
  const lfgWallet = LfgWallet.newFromPrivateKey(privateKey);
  lfgWallet.log();

  const publicKey = lfgWallet.publicKey();
  if (
    publicKey.replace("0x04", "0x") !==
    "0xf46c3b2e083a6f9b3c618bff2a7a1e9595c6e5f76756edfeca1783c0ac1a8e3c94d9667293f8dadc4d234b01c9c7456eef5e4d0eff1eae5ab4fcd3afc1c0d7a3"
  ) {
    throw new Error("PUBLIC_KEY is not correct");
  }

  console.info("\n========================================\n");

  // await debug("Register lfg", lfgWallet.registerLfg());
  // await debug(
  //   "Get public key from Ext gateway",
  //   lfgWallet.request({
  //     gateway: Gateway.ExtHeadless,
  //     channel: "lfg",
  //     contract: "public-key-contract",
  //     function: "GetMyProfile",
  //     payload: {},
  //     sign: true,
  //   })
  // );




  //   0x026471c7e81c2f534a1528d61cc4d2b1435a89e2e6f94e20b5421066aaeaa6ec293ce0a74e827996460537fa753dc0b7c0c1274d21b578deae57652bbcb8dc7f1c

  //   {
  //     "prefix": "\u0019Ethereum Signed Message:\n47",
  //     "signature": "0xd82fc97275e1317b6de71e0df772675148728f8c85e91d8ac3806c0396e53bd54f13038f38dccdeebab391172866216fce5f3f11ead147f191d5518e997d316d1c"
  // }

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
    })
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

  // await debug(
  //   "Get public key from Ext gateway",
  //   lfgWallet.request({
  //     gateway: Gateway.ExtHeadless,
  //     channel: "lfg",
  //     contract: "lfg-contract",
  //     function: "ProjectCreate",
  //     payload: {
  //       distribution: "QmWn8aQhwUFefPqBdm4W3s2ceve2CJ6MZMyqDnzeHLBCFt",
  //       name: "Tinguyen 03",
  //       description: "No description. Test only",
  //       image:
  //         "https://ipfs-ops-api.rep.run/ipfs/QmeGMLDnK4USHuyPPYYTWXfVry8tj3gSaFY8PyMhZyv1pD",
  //       version: "0.0.1",
  //     },
  //     sign: true,
  //   })
  // );
}

main();
