var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const symbol = "GRT";
    const name = "Gregor Token"
    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const num_tokens = 3;

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(symbol, name, {from: account_one});

            // mint multiple tokens
            for(let i = 0; i < num_tokens; i++) {
                await this.contract.mint(account_two, i, {from: account_one});
            }
        })

        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply();
            assert.equal(totalSupply, num_tokens, "Unexpected total supply!");
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf(account_two);
            assert.equal(balance, num_tokens, "Unexpected balance for token owner!");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            for(let i = 0; i < num_tokens; i++) {
                let tokenURI = await this.contract.tokenURI(i);
                assert.equal(tokenURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/" + i, "Unexpected token URI for token " + i);
            }
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_two, account_three, 1, {from:account_two});
            let owner = await this.contract.ownerOf(1);
            assert.equal(owner, account_three, "Token could not be transfered correctly");

            let balance1 = await this.contract.balanceOf(account_two);
            assert.equal(balance1, num_tokens - 1, "Unexpected balance for token owner of second account!");

            let balance2 = await this.contract.balanceOf(account_three);
            assert.equal(balance2, 1, "Unexpected balance for token owne of third account!");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(symbol, name, {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {
            let error = null;

            try {
                await this.contract.mint(account_three, 3, {from: account_two});
            } catch(e) {
                error = e.message;
            }

            expect(error).to.match(/Only the contract owner is allowed to execute this action/);
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner();
            assert.equal(owner, account_one, "Contract owner could not be retrieved!");
        })

    });
})