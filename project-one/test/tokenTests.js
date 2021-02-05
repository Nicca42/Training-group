const { ethers } = require("hardhat");
const { expect } = require("chai");

const initToken = async (minter, minterAddress, userAddress) => {
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

const allowanceFlow = async (tokenContract, minter, minterAddress, userAddress) => {
    const ten = ethers.utils.parseUnits("10", 18);

    const origAllowance = await tokenContract.allowance(minterAddress, userAddress);
    if(origAllowance === ethers.constants.Zero) {
        await tokenContract.connect(minter)
            .approve(userAddress, ten);
    } else if (origAllowance.lt(ten)) {
        await tokenContract.connect(minter)
            .increaseAllowance(userAddress, ten);
    }
    const adjustedAllowance = await tokenContract.allowance(minterAddress, userAddress);

    return adjustedAllowance;
}

describe("CollateralToken", () => {
    let minter;
    let user;
    let tokenContract;
    let minterAddress;
    let userAddress;
    const ten = ethers.utils.parseUnits("10", 18);

    beforeEach(async () => {
        const signers = await ethers.getSigners();
        minter = signers[0];
        user = signers[1];

        minterAddress = await minter.getAddress();
        userAddress = await user.getAddress();

        tokenContract = await initToken(minter, minterAddress, userAddress);
    })

    describe("ERC20 tests", async () => {
        describe("functions", async () => {
            it("returns name", async () => {
                expect(await tokenContract.name())
                    .to.equal("Test Token");
            });

            it("returns symbol", async () => {
                expect(await tokenContract.symbol())
                    .to.equal("TST");
            });

            it("returns decimals", async () => {
                expect(await tokenContract.decimals())
                    .to.equal(ethers.BigNumber.from(18));
            });

            it("returns total supply", async () => {
                // mintHundred checks supply
                await mintHundred(tokenContract, minter, minterAddress);
            });

            it("returns user balances", async () => {
                // mintHundred checks balances
                await mintHundred(tokenContract, minter, minterAddress);
            });

            it("returns user allowances", async () => {
                // allowanceFlow checks allowances
                allowanceFlow(tokenContract, minter, minterAddress, userAddress);
            });

            it("returns a non-user's balance as 0", async () => {
                expect(await tokenContract.balanceOf(ethers.constants.AddressZero))
                    .to.equal(ethers.constants.Zero);
            });

            it("approves as expected", async () => {
                // allowanceFlow checks approve
                allowanceFlow(tokenContract, minter, minterAddress, userAddress);
            });

            it("allows users to transfer as expected", async () => {
                await mintHundred(tokenContract, minter, minterAddress);
                const origMinterBalance = await tokenContract.balanceOf(minterAddress);
                const origUserBalance = await tokenContract.balanceOf(userAddress);
                const origTotalSupply = await tokenContract.totalSupply();

                await tokenContract.connect(minter)
                    .transfer(userAddress, ten);

                expect(await tokenContract.balanceOf(minterAddress))
                    .to.equal(origMinterBalance.sub(ten));
                expect(await tokenContract.balanceOf(userAddress))
                    .to.equal(origUserBalance.add(ten));
                expect(await tokenContract.totalSupply())
                    .to.equal(origTotalSupply);
            });

            it("allows approved users to transferFrom", async () => {
                await mintHundred(tokenContract, minter, minterAddress);
                const originalAllowance = await allowanceFlow(tokenContract, minter, minterAddress, userAddress);
                
                const origMinterBalance = await tokenContract.balanceOf(minterAddress);
                const origUserBalance = await tokenContract.balanceOf(userAddress);
                const origTotalSupply = await tokenContract.totalSupply();
                
                await tokenContract.connect(user)
                    .transferFrom(minterAddress, userAddress, ten);

                expect(await tokenContract.balanceOf(minterAddress))
                    .to.equal(origMinterBalance.sub(ten));
                expect(await tokenContract.balanceOf(userAddress))
                    .to.equal(origUserBalance.add(ten));
                expect(await tokenContract.allowance(minterAddress, userAddress))
                    .to.equal(originalAllowance.sub(ten));
                expect(await tokenContract.totalSupply())
                    .to.equal(origTotalSupply);
            });

            it("increases allowance as expected", async () => {
                const origAllowance = await allowanceFlow(tokenContract, minter, minterAddress, userAddress);
                await tokenContract.connect(minter)
                    .increaseAllowance(userAddress, ten);

                expect(await tokenContract.allowance(minterAddress, userAddress))
                    .to.equal(origAllowance.add(ten));
            });

            it("decreases allowance as expected", async () => {
                const origAllowance = await allowanceFlow(tokenContract, minter, minterAddress, userAddress);
                await tokenContract.connect(minter)
                    .decreaseAllowance(userAddress, ten);

                expect(await tokenContract.allowance(minterAddress, userAddress))
                    .to.equal(origAllowance.sub(ten));
            });

            // todo: expected fails (overextending allowance, sub-zero allowance)

        });

        describe("events", async () => {
            it("emits Transfer properly on transfer");

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

            it("emits Transfer properly on mint");

            it("emits Transfer properly on burn");
        })
    });

    describe("Ownable tests", async () => {
        describe("functions", async () => {
            it("returns owner");

            it("owner can transfer ownership");

            it("non-owner cannot add minters");
            
            it("owner can renounce ownership"); // this may bomb the event checks
        });

        describe("events", async () => {
            it("emits OwnershipTransferred on transfer");

            it("emits OwnershipTransferred on renounce");
        });
    });
})