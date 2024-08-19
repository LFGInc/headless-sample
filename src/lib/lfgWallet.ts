import axios from "axios";
import { instanceToPlain } from "class-transformer";
import {} from "ethers";
import { SigningKey, BaseWallet, Wallet } from "ethers";
import stringify from "json-stringify-deterministic";
import { v4 as uuidv4 } from "uuid";
import { LfgAxios } from "./axios";

export enum Gateway {
  Int = "https://proxy.dev-galachain-ops-api.rep.run/api/",
  Galaswap = "https://api-galaswap.gala.com/galachain/api/",
}

interface IRequest {
  gateway?: Gateway;
  channel: string;
  contract: string;
  function: string;
  payload: object;
}

export class LfgWallet {
  private _wallet: BaseWallet;
  private defaultGateway: string;

  constructor(w: BaseWallet) {
    this._wallet = w;
    this.defaultGateway = Gateway.Galaswap;
  }

  static newRandom(): LfgWallet {
    let w = Wallet.createRandom();
    return new LfgWallet(w);
  }

  static newFromPrivateKey(privateKey: string): LfgWallet {
    const k = new SigningKey(privateKey);
    let w = new BaseWallet(k, null);
    return new LfgWallet(w);
  }

  setDefaultGateway(gateway: Gateway) {
    this.defaultGateway = gateway;
  }

  ethUserId(): string {
    return `eth|${this._wallet.address.replace("0x", "")}`;
  }

  normalUserId(): string {
    return `client|${this._wallet.address.replace("0x", "")}`;
  }

  publicKey(): string {
    return this._wallet.signingKey.publicKey;
  }

  log() {
    console.log("Private key:", this._wallet.privateKey);
    console.log("Public key:", this.publicKey());
    console.log("Eth UserId:", this.ethUserId());
  }

  async registerHeadless() {
    try {
      const url = "https://api-galaswap.gala.com/v1/CreateHeadlessWallet";
      const response = await LfgAxios.post(url, {
        publicKey: this.publicKey(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async sign(payload: object): Promise<object> {
    const prefix = this.calculatePersonalSignPrefix(payload);
    const signerPublicKey = Buffer.from(
      this.publicKey().replace("0x", ""),
      "hex",
    ).toString("base64");
    const uniqueKey = "galaswap-operation-" + uuidv4();
    const prefixedPayload = {
      ...payload,
      prefix,
      uniqueKey,
      //signerPublicKey
    };

    const dto = this.getPayloadToSign(prefixedPayload);

    const sig = await this._wallet.signMessage(dto);
    return { ...prefixedPayload, sig };
  }

  async request(req: IRequest) {
    try {
      const url =
        (req.gateway ?? this.defaultGateway) +
        `${req.channel}/${req.contract}/${req.function}`;
      const body = await this.sign(req.payload);
      const headers = {
        "X-Wallet-Address": this.ethUserId(),
        "X-IDENTITY-LOOKUP-KEY": this.ethUserId(),
      };
      console.log({ url, body, headers });
      const response = await axios.post(url, body, {
        headers,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error?.response?.data;
      } else {
        throw new Error("Got a different error than axios");
      }
    }
  }

  private getPayloadToSign(obj: object): string {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { signature, trace, ...plain } = instanceToPlain(obj);
    return this.serialize(plain);
  }

  private serialize(object: unknown) {
    return stringify(instanceToPlain(object));
  }

  private calculatePersonalSignPrefix(payload: object): string {
    const payloadLength = this.getPayloadToSign(payload).length;
    const prefix = "\u0019Ethereum Signed Message:\n" + payloadLength;

    const newPayload = { ...payload, prefix };
    const newPayloadLength = this.getPayloadToSign(newPayload).length;

    if (payloadLength === newPayloadLength) {
      return prefix;
    }
    return this.calculatePersonalSignPrefix(newPayload);
  }
}
