// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

// check that b is bigger than a

contract Curve {
    constructor() {}

    function collateralToken() public pure returns (address) {}
    function bondedToken() public pure returns (address) {}

    function buyPrice(uint256 _amount) public {}
    function sellReward(uint256 _amount) public {}

    function mint(uint256 _amount) public returns (bool) {}
    function burn(uint256 _amount) public returns (bool) {}
}