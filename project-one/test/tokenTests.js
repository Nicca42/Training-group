const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

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
    });

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

            it("does not allow spending past balance", async () => {
                const origBalance = await tokenContract.balanceOf(minterAddress);
                await expect(tokenContract.connect(minter)
                    .transfer(userAddress, origBalance.add(ten))
                )
                .to.be.revertedWith("ERC20: transfer amount exceeds balance");                   
            });

            it("does not allow approving the zero address", async () => {
                await expect(tokenContract.connect(minter)
                    .approve(ethers.constants.AddressZero, ten)
                )
                .to.be.revertedWith("ERC20: approve to the zero address");
            })

            it("does not allow spending past allowance", async () => {
                await mintHundred(tokenContract, minter, minterAddress);
                const origAllowance = await tokenContract.allowance(minterAddress, userAddress);

                await expect(tokenContract.connect(user)
                    .transferFrom(minterAddress, userAddress, origAllowance.add(ten))
                )
                .to.be.revertedWith("ERC20: transfer amount exceeds allowance");
            })

            it("does not allow a sub-zero allowance", async () => {
                const origAllowance = await tokenContract.allowance(minterAddress, userAddress);

                await expect(tokenContract.connect(minter)
                    .decreaseAllowance(userAddress, origAllowance.add(ten))
                )
                .to.be.revertedWith("ERC20: decreased allowance below zero");
            })

            it("does not allow transfer to the zero address", async () => {
                await mintHundred(tokenContract, minter, minterAddress);

                await expect(tokenContract.connect(minter)
                    .transfer(ethers.constants.AddressZero, ten)
                )
                .to.be.revertedWith("ERC20: transfer to the zero address");
            })
        });

        describe("events", async () => {
            it("emits Transfer properly on transfer", async () => {
                await mintHundred(tokenContract, minter, minterAddress);
                await expect(tokenContract.connect(minter)
                    .transfer(userAddress, ten)
                )
                .to.emit(tokenContract, "Transfer")
                .withArgs(minterAddress, userAddress, ten);
            });

            it("emits Transfer properly on transferFrom", async () => {
                await mintHundred(tokenContract, minter, minterAddress);
                await allowanceFlow(tokenContract, minter, minterAddress, userAddress);

                await expect(tokenContract.connect(user)
                    .transferFrom(minterAddress, userAddress, ten)
                )
                .to.emit(tokenContract, "Transfer")
                .withArgs(minterAddress, userAddress, ten);
            })

            it("emits Approval properly", async () => {
                await expect(tokenContract.connect(minter)
                    .approve(userAddress, ten)
                )
                .to.emit(tokenContract, "Approval")
                .withArgs(minterAddress, userAddress, ten);
            });
        });
    });

    describe("CollateralToken-specific tests", async () => {
        describe("functions", async () => {
            it("mints properly", async () => {
                assert(await tokenContract.isMinter(minterAddress) === true,
                    "test should start with minter enabled as a minter");

                const origBalance = await tokenContract.balanceOf(minterAddress);
                await tokenContract.connect(minter)
                    .mint(minterAddress, ten);

                expect(await tokenContract.balanceOf(minterAddress))
                    .to.equal(origBalance.add(ten));
            });

            it("burns properly", async () => {
                assert(await tokenContract.isMinter(minterAddress) === true,
                    "test should start with minter enabled as a minter");

                await mintHundred(tokenContract, minter, minterAddress);
                const origBalance = await tokenContract.balanceOf(minterAddress);

                await tokenContract.connect(minter)
                    .burn(minterAddress, ten);

                expect(await tokenContract.balanceOf(minterAddress))
                    .to.equal(origBalance.sub(ten));
            });

            it("adds minters properly", async () => {
                assert(await tokenContract.owner() === minterAddress, 
                    "test should start with minter being owner");
                assert(await tokenContract.isMinter(userAddress) === false,
                    "test should start with user not enabled as a minter");

                await tokenContract.connect(minter)
                    .addMinter(userAddress);

                expect(await tokenContract.isMinter(userAddress))
                    .to.equal(true);

                // clean up
                await tokenContract.connect(minter)
                    .removeMinter(userAddress);

                expect(await tokenContract.isMinter(userAddress))
                    .to.equal(false);
            });

            it("removes minters properly", async () => {
                assert(await tokenContract.owner() === minterAddress, 
                    "test should start with minter being owner");

                await tokenContract.connect(minter)
                    .addMinter(userAddress);

                expect(await tokenContract.isMinter(userAddress))
                    .to.equal(true);

                await tokenContract.connect(minter)
                    .removeMinter(userAddress);

                expect(await tokenContract.isMinter(userAddress))
                    .to.equal(false);
            });

            it("non-minter cannot mint", async () => {
                assert(await tokenContract.isMinter(userAddress) === false,
                    "user should not start test enabled as a minter");

                await expect(tokenContract.connect(user)
                    .mint(userAddress, ten)
                )
                .to.be.revertedWith("unauthorized address");
            });

            it("non-minter cannot burn", async () => {
                assert(await tokenContract.isMinter(userAddress) === false,
                    "user should not start test enabled as a minter");

                await mintHundred(tokenContract, minter, minterAddress);

                await expect(tokenContract.connect(user)
                    .burn(minterAddress, ten)
                )
                .to.be.revertedWith("unauthorized address");
            });

            it("cannot mint to zero address", async () => {
                assert(await tokenContract.owner() === minterAddress, 
                    "test should start with minter being owner");

                await expect(tokenContract.connect(minter)
                    .mint(ethers.constants.AddressZero, ten)
                )
                .to.be.revertedWith("ERC20: mint to the zero address")
            });
        });

        describe("events", async () => {
            it("emits MinterAdded properly", async () => {
                assert(await tokenContract.owner() === minterAddress, 
                    "test should start with minter being owner");
                assert(await tokenContract.isMinter(userAddress) === false,
                    "user should not start test enabled as a minter");

                await expect(tokenContract.connect(minter)
                    .addMinter(userAddress)
                )
                .to.emit(tokenContract, "MinterAdded")
                .withArgs(minterAddress, userAddress);

                // clean up
                await expect(tokenContract.connect(minter)
                    .removeMinter(userAddress)
                )
                .to.emit(tokenContract, "MinterYeeted")
                .withArgs(minterAddress, userAddress);
            });

            it("emits MinterYeeted properly", async () => {
                assert(await tokenContract.owner() === minterAddress, 
                    "test should start with minter being owner");

                await expect(tokenContract.connect(minter)
                    .addMinter(userAddress)
                )
                .to.emit(tokenContract, "MinterAdded")
                .withArgs(minterAddress, userAddress);

                await expect(tokenContract.connect(minter)
                    .removeMinter(userAddress)
                )
                .to.emit(tokenContract, "MinterYeeted")
                .withArgs(minterAddress, userAddress);
            });

            it("emits Transfer properly on mint", async () => {
                assert(await tokenContract.isMinter(minterAddress) === true,
                    "minter should start test enabled as a minter");

                await expect(tokenContract.connect(minter)
                    .mint(userAddress, ten)
                )
                .to.emit(tokenContract, "Transfer")
                .withArgs(ethers.constants.AddressZero, userAddress, ten);
            });

            it("emits Transfer properly on burn", async () => {
                assert(await tokenContract.isMinter(minterAddress) === true,
                    "minter should start test enabled as a minter");
                await mintHundred(tokenContract, minter, minterAddress);

                await expect(tokenContract.connect(minter)
                    .burn(minterAddress, ten)
                )
                .to.emit(tokenContract, "Transfer")
                .withArgs(minterAddress, ethers.constants.AddressZero, ten);
            });
        })
    });

    describe("Ownable tests", async () => {
        describe("functions", async () => {
            it("returns owner", async () => {
                expect(await tokenContract.owner())
                    .to.equal(minterAddress);
            });

            it("owner can transfer ownership", async () => {
                assert(await tokenContract.owner() === minterAddress, 
                    "test should start with minter being owner");

                await tokenContract.connect(minter)
                    .transferOwnership(userAddress);

                expect(await tokenContract.owner())
                    .to.equal(userAddress);

                // switch back for cleanup
                await tokenContract.connect(user)
                    .transferOwnership(minterAddress);

                expect(await tokenContract.owner())
                    .to.equal(minterAddress);
            });

            it("owner can add minters", async () => {
                assert(await tokenContract.owner() === minterAddress, 
                    "test should start with minter being owner");
                assert(await tokenContract.isMinter(userAddress) === false,
                    "test should start with user not enabled as a minter");

                await tokenContract.connect(minter)
                    .addMinter(userAddress);

                expect(await tokenContract.isMinter(userAddress))
                    .to.equal(true);

                // clean up
                await tokenContract.connect(minter)
                    .removeMinter(userAddress);

                expect(await tokenContract.isMinter(userAddress))
                    .to.equal(false);
            });

            it("owner can remove minters", async () => {
                assert(await tokenContract.owner() === minterAddress, 
                    "test should start with minter being owner");

                await tokenContract.connect(minter)
                    .addMinter(userAddress);

                expect(await tokenContract.isMinter(userAddress))
                    .to.equal(true);

                await tokenContract.connect(minter)
                    .removeMinter(userAddress);

                expect(await tokenContract.isMinter(userAddress))
                    .to.equal(false);
            })

            it("non-owner cannot add minters", async () => {
                assert(await tokenContract.isMinter(userAddress) === false,
                    "test should start with user not enabled as a minter");

                await expect(tokenContract.connect(user)
                    .addMinter(ethers.constants.AddressZero)
                )
                .to.be.revertedWith("Ownable: caller is not the owner")
            });

            
            it("non-owner cannot add minters even if they are a minter", async () => {
                await tokenContract.connect(minter)
                    .addMinter(userAddress);

                expect(await tokenContract.isMinter(userAddress))
                    .to.equal(true);

                await expect(tokenContract.connect(user)
                    .addMinter(ethers.constants.AddressZero)
                )
                .to.be.revertedWith("Ownable: caller is not the owner")
            });
        });
        
        describe("events", async () => {
            it("emits OwnershipTransferred on transfer", async () => {
                assert(await tokenContract.owner() === minterAddress, 
                    "test should start with minter being owner");
                
                await expect(tokenContract.connect(minter)
                    .transferOwnership(userAddress)
                )
                .to.emit(tokenContract, "OwnershipTransferred")
                .withArgs(minterAddress, userAddress);

                await expect(tokenContract.connect(user)
                    .transferOwnership(minterAddress)
                )
                .to.emit(tokenContract, "OwnershipTransferred")
                .withArgs(userAddress, minterAddress);
            });
            
            it("emits OwnershipTransferred on renounce", async () => {
                await expect(tokenContract.connect(minter)
                    .renounceOwnership()
                )
                .to.emit(tokenContract, "OwnershipTransferred")
                .withArgs(minterAddress, ethers.constants.AddressZero);
            });
        });
        
        describe("destructive functions", () => {
            // this may bomb future event checks
            it("owner can renounce ownership", async () => {
                assert(await tokenContract.owner() === minterAddress, 
                    "test should start with minter being owner");
                
                // including event check in the function check for now
                await expect(tokenContract.connect(minter)
                    .renounceOwnership()
                )
                .to.emit(tokenContract, "OwnershipTransferred")
                .withArgs(minterAddress, ethers.constants.AddressZero);

                expect(await tokenContract.owner())
                    .to.equal(ethers.constants.AddressZero);
            }); 
    
            it("owner cannot add or remove minters after renouncing", async () => {
                if(await tokenContract.owner() !== ethers.constants.AddressZero) {
                    await tokenContract.connect(minter)
                        .renounceOwnership();
                };
                assert(await tokenContract.isMinter(minterAddress) === true,
                    "test should start with minter enabled as a minter");
                assert(await tokenContract.isMinter(userAddress) === false,
                    "test should start with user not enabled as a minter");
                
                await expect(tokenContract.connect(minter)
                    .addMinter(userAddress)
                )
                .to.be.revertedWith("Ownable: caller is not the owner");

                await expect(tokenContract.connect(minter)
                    .removeMinter(minterAddress)
                )
                .to.be.revertedWith("Ownable: caller is not the owner");
            });

        })
    });
})