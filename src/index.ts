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
  const privateKey = "0xceb48a42ca8e1d249ce047d3ef31f70411397f152551aa9d3349132114aa1a9a"
  const lfgWallet = LfgWallet.newFromPrivateKey(privateKey)
  lfgWallet.log()

  await debug("Get public key from Swap gateway:",
    lfgWallet.request({
      gateway: Gateway.Galaswap,
      channel: "asset",
      contract: "public-key-contract",
      function: "GetPublicKey",
      payload: { user: lfgWallet.ethUserId() }
    }));

  // await debug("Getpublickey from Int gateway:",
  //   lfgWallet.request({
  //     gateway: Gateway.Int,
  //     channel: "asset",
  //     contract: "public-key-contract",
  //     function: "GetPublicKey",
  //     payload: { user: lfgWallet.ethUserId() }
  //   }));

  await debug("Get balance from Swap gateway:",
    lfgWallet.request({
      gateway: Gateway.Galaswap,
      channel: "asset",
      contract: "token-contract",
      function: "FetchBalances",
      payload: { user: lfgWallet.ethUserId() }
    }))
}

main()

