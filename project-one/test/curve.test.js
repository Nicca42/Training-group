import chai from 'chai';
const { expect } = require("chai");
const Curve = artifacts.require("Curve");


describe("Curve contract", function() {
    let deployer;
    let user;
    let exampleToken;
    let amount = 1000;
    let transferAmount = 500;

    beforeEach(async () => {
        const signers = await ethers.getSigners();
        deployer = signers[0];
        user = signers[1];

        const Curve = await ethers.getContractFactory("Token");
       
        exampleToken = await Token.deploy();
    });
    describe("buy Price", async function () {

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
    describe("curve integral", async function () {

    });
})