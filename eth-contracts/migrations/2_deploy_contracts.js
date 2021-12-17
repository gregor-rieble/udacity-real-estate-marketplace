// migrating the appropriate contracts
// var ERC721MintableComplete = artifacts.require("./SquareVerifier.sol");
var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
const fs = require('fs');

module.exports = function(deployer) {
  // deployer.deploy(ERC721MintableComplete, "GRT", "Gregor Token");
  deployer.deploy(SquareVerifier).then(() => {
    return deployer.deploy(SolnSquareVerifier, "GRT", "Gregor Token", SquareVerifier.address).then(() => {
      fs.writeFileSync(__dirname + '/../.contract.json',JSON.stringify({ address: SolnSquareVerifier.address }, null, '\t'), 'utf-8');
    });
  });
};
