# Guide to mint the gala token

### Create Token Class

```typescript
const createTokenClass = async () => {
  const nftData = {
    isNonFungible: true,
    rarity: "rare", // Optional, for NFTs
  };
  const tokenData = {
    authorities: [lfgWallet.ethUserId()], // Replace with actual authority ID
    decimals: 17, // Defaults to 0 for NFTs
    description: "LFGW Token",
    image: "https://avatars.githubusercontent.com/u/170529262?s=200&v=4", // URL of the token's image
    // isNonFungible: true, // Set true for NFT
    maxCapacity: "123456789",
    maxSupply: "123456789", // Defaults to "Infinity"
    metadataAddress: "ipfs://QmXo1z832Y4Q79qWnYb9z31y88T2VZJYXjFm5nHq1p", // Optional
    name: "LFGW Token",
    prefix: "LFGW",
    symbol: "LFGW",
    network: "GC", // Default
    tokenClass: {
      ...customTokenInstance,
      signing: "ETH",
    },
    totalBurned: "0", // Defaults to "0"
    totalMintAllowance: "123456789",
    totalSupply: "123456789", // Defaults to "0"
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

const customTokenInstance: TokenInstance = {
  additionalKey: "version2",
  category: "LFGW",
  collection: "LFGW",
  type: "none",
};
```

The GalaChain network will check the token by the fomula:

GCTILFGWLFGWnoneversion2

```
network | tokenClass.signing | tokenClass.category | tokenClass.collection | tokenClass.type | tokenClass.additionalKey
```

### Grant Allowance

```
const grantAllowance = async () => {
  const payload = {
    allowanceType: AllowanceType.Mint,
    tokenInstance: {
      ...customTokenInstance,
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

```

### Mint Token

```typescript
const mintToken = async () => {
  const payload = {
    uniqueKey: new Date().getTime().toString(),
    owner: lfgWallet.ethUserId(),
    quantity: "100",
    tokenClass: customTokenInstance,
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
```
