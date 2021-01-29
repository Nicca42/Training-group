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

    modifier isMinter() {
        require(
            minters[msg.sender],
            "Caller must be minter"
        );
        _;
    }

    function addMinter(address _newMinter) public isMinter() {
        minters(_newMinter) = true;
    }

    function mint(address account, uint256 amount) public isMinter() {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public isMinter() {
        _burn(account, amount);
    }

    
}