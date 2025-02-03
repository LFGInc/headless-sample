import { describe, test } from "bun:test";
import { Gateway, LfgWallet } from "../src/lib";

const timeout = 20_000;

describe("deploy-token", () => {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY is not set");
  }

  const lfgWallet = LfgWallet.newFromPrivateKey(privateKey);
  lfgWallet.log();

  test(
    "register-user",
    async () => {
      console.log("register-user");

      const payload = {
        publicKey: lfgWallet.publicKey(),
        user: lfgWallet.normalUserId(),
      };

      console.log(payload);

      const response = await lfgWallet.request({
        gateway: Gateway.ExtHeadless,
        channel: "quoxent",
        contract: "public-key-contract",
        function: "RegisterUser",
        payload,
        sign: true,
      });

      console.log(response);
    },
    {
      timeout,
    }
  );
});
