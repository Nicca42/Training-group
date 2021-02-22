// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CollateralToken is ERC20 {
    constructor() 
    ERC20(
        "Collateral Token",
        "CLT"
    ) {
        // FB shouldn't hardcode variables in constructor. Other than that nice
        // simple implementation. 
    }
    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }
}

/**
FB I also don't know how or why, but I get the following error when trying to 
compile your contracts:

{ [Error: EISDIR: illegal operation on a directory, read] errno: -21, code: 'EISDIR', syscall: 'read' }
error Command failed with exit code 1.

I don't even know how that is possible or what is happening. 
 */