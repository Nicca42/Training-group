const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const initContracts = async (minter, minterAddress, userAddress) => {
    const TokenContract = await ethers.getContractFactory("CollateralToken");
    const tokenContract = await TokenContract.connect(minter).deploy();
    await tokenContract.deployed();

    const CollateralContract = await ethers.getContractFactory("MockToken");
    const collateralContract = await CollateralContract.connect(minter).deploy();
    await collateralContract.deployed();

    const CurveContract = await ethers.getContractFactory("Curve");
    const curveContract = await CurveContract.connect(minter).deploy(collateralToken.address, tokenContract.address);
    await curveContract.deployed();

    const hundred = ethers.utils.parseUnits("100", 18);

    expect(await tokenContract.balanceOf(minterAddress))
        .to.equal(ethers.constants.Zero);
    expect(await tokenContract.balanceOf(userAddress))
        .to.equal(ethers.constants.Zero);
    expect(await tokenContract.totalSupply())
        .to.equal(ethers.constants.Zero);

    expect(await collateralContract.balanceOf(minterAddress))
        .to.equal(ethers.constants.Zero);
    expect(await collateralContract.balanceOf(userAddress))
        .to.equal(ethers.constants.Zero);
    expect(await collateralContract.totalSupply())
        .to.equal(ethers.constants.Zero);

    collateralContract.connect(minter).mint(minterAddress, hundred);
    collateralContract.connect(user).mint(userAddress, hundred);

    expect(await collateralContract.balanceOf(minterAddress))
        .to.equal(hundred);
    expect(await collateralContract.balanceOf(userAddress))
        .to.equal(hundred);
    expect(await collateralContract.totalSupply())
        .to.equal(hundred.add(hundred));

    return { tokenContract, collateralContract, curveContract }
}

describe("Curve", () => {
    let minter;
    let user;
    let tokenContract;
    let collateralContract;
    let curveContract;
    let minterAddress;
    let userAddress;
    const ten = ethers.utils.parseUnits("10", 18);

    beforeEach(async () => {
        const signers = await ethers.getSigners();
        minter = signers[0];
        user = signers[1];

        minterAddress = await minter.getAddress();
        userAddress = await user.getAddress();

        const contracts = await initContracts(minter, minterAddress, userAddress);

        tokenContract = contracts.tokenContract;
        collateralContract = contracts.collateralContract;
        curveContract = contracts.curveContract;
    });

    describe("Curve tests", () => {
        describe("functions", async () => {
            it("returns token address for the accepted token");

            it("returns token address for the token on the curve");

            it("estimates buy price");

            it("estimates sell price");

            it("curve mints properly");

            it("curve burns properly");
        });

        describe("min/max values", async () => {
            it("curve can handle very small values");

            it("curve can handle very large values");
        });

        describe("stress tests", async () => {
            it("mints properly: 2500 iterations");

            it("burns properly: 2500 iterations");

            it("mints and burns properly: 2500 rounds");
        })
    })
})