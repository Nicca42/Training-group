// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CollateralToken is ERC20 {
    mapping(address => bool) minters;
    constructor() 
    ERC20(
        "Collateral Token",
        "CLT"
    ) {
        minters (msg.sender) = true;
    }
    function mint(address account, uint256 amount) public onlyOwner{
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }

    function addMinter(address account) private onlyOwner {
        minters(account);
    }
}