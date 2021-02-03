const { ethers } = require("hardhat");
const { expect } = require("chai");

const initToken = async minter => {
    const TokenContract = await ethers.getContractFactory("CollateralToken");
    const tokenContract = await TokenContract.connect(minter).deploy();
    await tokenContract.deployed();

    expect(await tokenContract.balanceOf(minterAddress))
        .to.equal(ethers.constants.Zero);
    expect(await tokenContract.balanceOf(userAddress))
        .to.equal(ethers.constants.Zero);
    expect(await tokenContract.totalSupply())
        .to.equal(ethers.constants.Zero);

    return tokenContract
}

const mintHundred = async (tokenContract, minter, minterAddress) => {
    const origMinterBalance = await tokenContract.balanceOf(minterAddress);
    const origTotalSupply = await tokenContract.totalSupply();

    await tokenContract
        .connect(minter)
        .mint(minterAddress, ethers.utils.parseUnits("100", 18));

    expect(await tokenContract.balanceOf(minterAddress))
        .to.equal(origMinterBalance.add(ethers.utils.parseUnits("100", 18)));
    expect(await tokenContract.totalSupply())
        .to.equal(origTotalSupply.add(ethers.utils.parseUnits("100", 18)));
}

describe("CollateralToken", () => {
    let minter;
    let user;
    let tokenContract;
    let minterAddress;
    let userAddress;

    beforeEach(async () => {
        const signers = await ethers.getSigners();
        minter = signers[0];
        user = signers[1];

        minterAddress = await minter.getAddress();
        userAddress = await user.getAddress();

        const TokenContract = await ethers.getContractFactory("CollateralToken");
        tokenContract = await TokenContract.connect(minter).deploy();
        await tokenContract.deployed();
    })

    describe("ERC20 tests", async () => {
        describe("functions", async () => {
            it("returns total supply", async () => {
                // mintHundred checks supply
                await mintHundred(tokenContract, minter, minterAddress);
            });

            it("returns user balances", async () => {
                const expectedMinterBalance = ethers.utils.parseUnits("100", 18);
                const expectedUserBalance = ethers.constants.Zero;
                expect(await tokenContract.balanceOf(minterAddress))
                    .to.equal(expectedUserBalance);
                expect(await tokenContract.balanceOf(userAddress))
                    .to.equal(expectedUserBalance);
            });

            it("returns a non-user's balance as 0", async () => {
                expect(await tokenContract.balanceOf(ethers.constants.AddressZero))
                    .to.equal(ethers.constants.Zero);
            });

            it("approves as expected", async () => {
                const origAllowance = await tokenContract.allowance(minterAddress, userAddress);
                await tokenContract.approve(userAddress, ethers.utils.parseUnits("10", 18));
                expect(await tokenContract.allowance(minterAddress, userAddress))
                    .to.equal(origAllowance.add(ethers.utils.parseUnits("10", 18)));
            });

            it("allows approved users to transfer");

        });

        describe("events", async () => {
            it("emits Transfer properly on transfer");

            it("emits Transfer properly on mint");

            it("emits Transfer properly on burn");

            it("emits Approval properly");
        });
    });

    describe("CollateralToken-specific tests", async () => {
        describe("functions", async () => {
            it("mints properly");

            it("burns properly");

            it("adds minters properly");

            it("non-minter cannot mint");

            it("non-minter cannot burn");
        });

        describe("events", async () => {
            it("emits MinterAdded properly");
        })
    });

    describe("Ownable tests", async () => {
        describe("functions", async () => {
            it("returns owner");

            it("owner can transfer ownership");

            it("owner can renounce ownership"); // this may bomb the event checks

            it("non-owner cannot add minters");
        });

        describe("events", async () => {
            it("emits OwnershipTransferred on transfer");

            it("emits OwnershipTransferred on renounce");
        });
    });
})