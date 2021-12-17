// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
var SquareVerifier = artifacts.require('SquareVerifier');


contract('SquareVerifier', accounts => {
  const account_one = accounts[0];

  describe('Zokrates verifier tests', function () {
    beforeEach(async function () { 
        this.contract = await SquareVerifier.new({from: account_one});
    })

    // Test verification with correct proof
    // - use the contents from proof.json generated from zokrates steps
    it('Test verification with correct proof', async function () { 
        let proof = require('../proofs/proof-1.json');
        let result = await this.contract.verifyTx.call(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
        assert.equal(result, true, "Proof could not be validated");
    })

    // Test verification with incorrect proof
    it('Test verification with incorrect proof', async function () { 
        let proof = require('../proofs/proof-1.json');
        let result = await this.contract.verifyTx.call(proof.proof.a, proof.proof.b, proof.proof.c, [
          "0x000000000000000000000000000000000000000000000000000000000000005", 
          "0x0000000000000000000000000000000000000000000000000000000000000003"
        ]);
        assert.equal(result, false, "Invalid proof has been validated");
    })
  });
});
    