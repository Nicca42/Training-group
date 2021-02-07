const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const initContracts = async (minter, minterAddress) => {
    const TokenContract = await ethers.getContractFactory("CollateralToken");
    const tokenContract = await TokenContract.connect(minter).deploy();
    await tokenContract.deployed();

    const CollateralContract = await ethers.getContractFactory("MockToken");
    const collateralContract = await CollateralContract.connect(minter).deploy();
    await collateralContract.deployed();

    const CurveContract = await ethers.getContractFactory("Curve");
    const curveContract = await CurveContract.connect(minter).deploy();
    await curveContract.deployed();

    // should run some tests here, maybe give out some Mock

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

        const contracts = await initContracts(minter, minterAddress);

        tokenContract = contracts.tokenContract;
        collateralContract = contracts.collateralContract;
        curveContract = contracts.curveContract;
    });
})