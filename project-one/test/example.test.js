const { expect } = require("chai");

describe("Example contract", function() {
        // User accounts
        let owner;
        let user;
        // Creating an instance for the contract
        let hardHatToken;

    beforeEach(async () => {
        // Any set up that needs to happen before each test

        // Getting the signers provided by ethers
        const signers = await ethers.getSigners();
        owner = signers[0];
        user = signers[1];

        // Getting the token code (abi, bytecode, name)
        const Token = await ethers.getContractFactory("CollateralToken");
        // Deploying the token contract
        hardHatToken = await Token.deploy();
    });

    describe("Available tests", function() {
        /**
         * This test is formatted a little weirdly to allow for comments to explain
         * what is going on
         */
        it("Event test", async function() {
            // Checking that the transfer emits the expected event
            await expect(
            // the actual transfer function call
            hardHatToken.transfer(user.address, 7)
            // checking the event name 
            ).to.emit(hardHatToken, 'transferEvent')
            // Checking the event emits the expected values
            .withArgs(owner.address, user.address, 7);
        });
        /**
         * Tests that a contract call reverts (again, formatted weirdly for comments)
         */
        it("Revert call test", async function() {
            // Normal expect
            await expect(
            // Connecting the user wallet to the token contract
            hardHatToken.connect(user)
                // The contract call being called (transfer)
                .transfer(owner.address, 1007)
                // Specifying that it is expected to be reverted
            ).to.be.reverted;
        });
           /**
         * Tests that a contract call reverts (again, formatted weirdly for comments)
         */
        it("Revert call test", async function() {
            // Normal expect
            await expect(
            // Connecting the user wallet to the token contract
            hardHatToken.connect(user)
                // The contract call being called (transfer)
                .transfer(owner.address, 1007)
                // Specifying that it is expected to be reverted
            ).to.be.reverted;
        });
        /**
         * Tests that a contract call reverts (again, formatted weirdly for comments)
         */
        it("Revert call (with error message) test", async function() {
            // Normal expect
            await expect(
                // Connecting the user wallet to the token contract
                hardHatToken.connect(user)
                // The contract call being called (transfer)
                .transfer(owner.address, 1007)
                // Specifying the error messaged expected with revert
            ).to.be.revertedWith("Not enough tokens");
        });
        /**
         * Tests that a user can send ETH and that the ETH balance changes as expected.
         * Ignores gas fees by default
         * @notice  If there is more than one transaction mined in the same block
         *          `changeEtherBalance` will not work
         */
        it("Sending ETH test", async function() {
            // Normal expect
            await expect(
                // Calling sendTransaction on the signer allows the sending of ETH directly
                await owner.sendTransaction(
                {to: user.address, value: 200}
                )
                // Checking that the ETH balance changes as expected (accounts for gas)
            ).to.changeEtherBalance(
                // The signer to check
                user, 
                // The amount
                200
            );
        });
        /**
         * Tests that a contract call reverts (again, formatted weirdly for comments)
         * @notice  If there is more than one transaction mined in the same block
         *          `changeEtherBalance` will not work
         */
        it("Sending ETH (gas included) test", async function() {
            // Normal expect
            await expect(
                // Sending ETH
                await owner.sendTransaction(
                // Specifying the gas price (for consistency)
                {to: user.address, gasPrice: 1, value: 200}
                )
                // Notice the included fee switch, which will include the fees in the 
                // changed balance calculations
            ).to.changeEtherBalance(
                // The signer to check
                owner, 
                // The amount
                -21200, 
                // Switches (to include fees)
                {includeFee: true}
            );
        });
        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await hardhatToken.balanceOf(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        });
    });
});