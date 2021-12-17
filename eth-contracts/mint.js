const fs = require("fs");
const config = require("./truffle-config.js");
const Contract = require('web3-eth-contract');
const Web3 = require('web3');

const env = process.argv[2] || 'development';
const address = config.networks[env] && config.networks[env].contract || JSON.parse(fs.readFileSync(".contract.json")).address;

let providerFunc = config.networks[env].provider;
if(!providerFunc) {
  providerFunc = () => 'ws://' + config.networks[env].host + ':' + config.networks[env].port;
} else if(typeof providerFunc !== 'function') {
  providerFunc = () => providerFunc;
}

const provider = providerFunc();
const web3 = new Web3(provider);
Contract.setProvider(provider);

const jsonInterface = require('./build/contracts/SolnSquareVerifier.json');
const contract = new Contract(jsonInterface.abi, address);
const proofs = fs.readdirSync("./proofs");

const gas = config.networks[env].gas || 6700000;

mint().then(() => console.log("Tokens successfully minted!")).catch(e => console.error(e)).finally(() => process.exit(0));

async function mint() {
  let accounts = await web3.eth.getAccounts();

  let tokenId = 0;
  for(let proofFile of proofs) {
    let rawdata = fs.readFileSync("./proofs/" + proofFile);
    let proof = JSON.parse(rawdata);
  
    await contract.methods.addSolution(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs).send({ from: accounts[0], gas });
    console.log("Solution", tokenId, "added");
    await contract.methods.mint(tokenId, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs).send({ from: accounts[0], gas });
    console.log("Token", tokenId, "minted");

    tokenId++;
  }
}