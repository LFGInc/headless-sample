#!/bin/bash
curl --request POST \
  --url https://api-galaswap.gala.com/galachain/api/asset/public-key-contract/GetPublicKey \
  --header 'Content-Type: application/json' \
  --data '{"user": "client|c614C2C83fC0f059577F33B1292CdFc612b94e8E"}'
