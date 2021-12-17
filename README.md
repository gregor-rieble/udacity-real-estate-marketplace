# Udacity Blockchain Capstone

This project was made for the Udacity blockchain developer nanodegree program. It is the final project to complete the nanodegree.

## Prerequesites

1. Node.js 13.12.0 with npm 6.14.4 or higher: https://nodejs.org/en/download/
2. Truffle v5.4.22 or higher: `npm install -g truffle`
3. Solidity compiler (solc) `0.5.5` (should automatically be picked up and installed when compiling the contracts with truffle as it is configured in the `eth-contracts/truffle-config.js` file)
4. Ganache CLI v6.12.2 (ganache-core: 2.13.2) or higher `npm install -g ganache-cli`
5. [Optional] If you want to adapt the Zokrates Verifier or add additional proofs, you will also need `docker`

## Quickstart

1. Install dependencies: `npm install`
2. Start ganache-cli: `npm run ganache`
3. Compile and migrate contracts: `npm run migrate`
4. Execute tests: `npm run test`
5. [Optional] Mint tokens: `npm run mint`

## Rinkeby

The SolnSquareVerifier has been deployed on the Rinkeby test network. The contract address is
```
0x926D83cd991A1a8542Cb6e2B23D278561bd0E452
```

Token on Etherscan (Rinkeby): https://rinkeby.etherscan.io/tokens?q=0x926D83cd991A1a8542Cb6e2B23D278561bd0E452

Contract on Etherscan (Rinkeby): https://rinkeby.etherscan.io/address/0x926D83cd991A1a8542Cb6e2B23D278561bd0E452

## OpenSea

A OpenSea collection has been created on the OpenSea Testnets marketplace. The collection URL is

https://testnets.opensea.io/collection/grt

## Generate Zokrates Proofs

Run zokrates docker container with specified version. Make sure to run the docker command within the project directory:

> NOTE: If not on windows, you need to replace the %CD% placeholder accordingly (absolute path to project directory)

```
docker run --rm --name zokrates -v %CD%/zokrates/code:/home/zokrates/code -ti zokrates/zokrates:0.4.10 /bin/bash
```

Within the zokrates console, execute the following commands to generate a new proof:

> NOTE: You can replace the solution arguments `3` and `9` accordingly, as long as the equation `a²=b` is satisfied.

```
cd code/square
~/zokrates compute-witness -a 3 9
~/zokrates generate-proof
```

You should find a `proof.json` file that can be used within the `zokrates/code/square` directory (outside of docker within the project directory).