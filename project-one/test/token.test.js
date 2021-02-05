const { expect } = require("chai");

describe("Token contract", function() {
  it("Deployment should assign the total supply of tokens to the owner", async function() {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const hardhatToken = await Token.deploy();

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    console.log('ownerB:', ownerBalance.toString())
    const tokenSupply = await hardhatToken.totalSupply()
    console.log('tokenSupply:', tokenSupply.toString())
    expect(tokenSupply).to.equal(ownerBalance);
  });
});

// describe("Token contract", function () {
//   let deployer;
//   let user;
//   let exampleToken;
//   let amount = 1000;
//   let transferAmount = 500;
//   let instance;

//   beforeEach(async () => {
//     const signers = await ethers.getSigners();
//     deployer = signers[0];
//     user = signers[1];

//     const Token = await ethers.getContractFactory("Token");
//     // Deploying the token contract
//     exampleToken = await Token.deploy();
//   });

//   describe("add minter", async function () {
//     it("should check owner account as minter", async () => {
//       let minter = await instance.minter();
//       assert.equal(minter, owner, "Owner Account is not the minter");
//     });

//     it("should throw if mint is called not from minter account", async () => {
//       try {
//         await instance.mint(accounts[2], amount, { from: accounts[1] });
//       } catch (error) {
//         assert.throws(
//           () => {
//             throw new Error(error);
//           },
//           Error,
//           "Unauthorized Access"
//         );
//       }
//     });
//     // it("Event test", async function() {
//     //     await expect(
//     //     hardHatToken.transfer(user.address, 7)
//     //     ).to.emit(hardHatToken, 'transferEvent')
//     //     .withArgs(owner.address, user.address, 7);
//     // });
//   });

//   describe("mint", async function () {
//     // _mint(_to, _amount)
//   });

//   describe("burn", async function () {});
// });
