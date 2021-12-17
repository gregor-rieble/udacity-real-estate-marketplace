var SquareVerifier = artifacts.require('SquareVerifier');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

contract('SolnSquareVerifier', accounts => {
  const symbol = "GRT";
  const name = "Gregor Token";
  const account_one = accounts[0];
  const account_two = accounts[1];

  describe('SolnSquareVerifier tests', function () {
    before(async function () { 
        this.proof = require('../proofs/proof-1.json');
        this.verifier = await SquareVerifier.new({from: account_one});
        this.contract = await SolnSquareVerifier.new(symbol, name, this.verifier.address, {from: account_one});
    })

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('Test if a new solution can be added for contract', async function () {
        let tx = await this.contract.addSolution(this.proof.proof.a, this.proof.proof.b, this.proof.proof.c, this.proof.inputs, {from: account_two});
        
        let event = tx.logs[0];

        assert.notEqual(event, null, "No event emitted");
        assert.equal(event.args.index, 0, "Incorrect solution index");
        assert.equal(event.args.addr, account_two, "Incorrect solution owner");
    })

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('Test if an ERC721 token can be minted for contract', async function () {
        let mintMethod = this.contract.methods['mint(uint256,uint256[2],uint256[2][2],uint256[2],uint256[2])'];
        await mintMethod(0, this.proof.proof.a, this.proof.proof.b, this.proof.proof.c, this.proof.inputs, {from: account_two});

        let balance = await this.contract.balanceOf(account_two);
        assert.equal(balance, 1, "Unexpected balance for token owner!");
    })
  });
});
    

