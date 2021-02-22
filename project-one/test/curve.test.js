const { expect } = require("chai");
// const Curve = artifacts.require("Curve");

describe("Curve contract", function() {
    let deployer;
    let user;
    let exampleToken;
    let token;
    let collateralToken;
    let amount = 1000;
    let transferAmount = 500;

    beforeEach(async () => {
        const signers = await ethers.getSigners();
        deployer = signers[0];
        user = signers[1];

        const Curve = await ethers.getContractFactory("Curve");
        const CollateralToken = await ethers.getContractFactory("CollateralToken");
        const Token = await ethers.getContractFactory("Token");
       
        collateralToken = await CollateralToken.deploy();
        token = await Token.deploy();
        exampleToken = await Curve.deploy(token.address, collateralToken.address);
    });
    describe("buy Price", async function () {
        it("returns the correct buy price", async function() {
            const testTokenSupply = await token.totalSupply()
            const supplyAsString = testTokenSupply.toString()
            console.log('supplyAsString:', supplyAsString)
            /**
             * FB you were on the right track here, but it is failing because
             * your buy amount is waaay too small. Remember the token is 
             * scaled by 18 0's for decimals. 
             * If you change the buy amount to 
             * ethers.utils.parseUnits(7, 18)
             * (ethers will scale the first number, 7 by the specified number
             * of decimals (18), the second number)
             * you will get a result. 
             */
            const buyPriceResult = await exampleToken.buyPrice(7)
            await expect(buyPriceResult).to.eq("1")
        });
        it("protects against invalid", async function() {
            expect(await exampleToken.buyPrice(-1)).to.throw();
        });
    });
    describe("sell reward", async function () {

    });
    describe("collateral token", async function () {

    });
    describe("bonded token", async function () {

    });
    describe("mint", async function () {

    });
    describe("burn", async function () {

    });
});

/**
 * FB to group your tests it is better to have 'describe' for each of the 
 * major functionality sections, 
 * i.e describe 'buy Functionality' 
 * which then has it's of:
 * expected price correct
 * reverts on invalid buy 
 * 
 * and so on. 
 */