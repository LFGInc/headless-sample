import { expect, test, describe } from "bun:test";
import { LfgWallet } from "../src/lib";

describe("mint-token", () => {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY is not set");
  }

  const lfgWallet = LfgWallet.newFromPrivateKey(privateKey);
  lfgWallet.log();
  
  test("mint-token", async () => {
    console.log("mint-token", lfgWallet);
  });
});
