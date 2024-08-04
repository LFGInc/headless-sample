import { debug, Gateway, LfgWallet } from "./lib";

async function main() {
  const lfgWallet = LfgWallet.newRandom()
  lfgWallet.log()
  await debug("Register headless wallet:", lfgWallet.registerHeadless());
  await debug("Getpublickey from Galaswap gateway:",
    lfgWallet.request({
      gateway: Gateway.Galaswap,
      channel: "asset",
      contract: "public-key-contract",
      function: "GetPublicKey",
      payload: { user: lfgWallet.userId() }
    })
  );
  await debug("Getpublickey from Int gateway:",
    lfgWallet.request({
      gateway: Gateway.Int,
      channel: "asset",
      contract: "public-key-contract",
      function: "GetPublicKey",
      payload: { user: lfgWallet.userId() }
    }))
}

main()
