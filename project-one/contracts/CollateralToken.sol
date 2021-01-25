// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CollateralToken is ERC20 {
    address public deployer;
    address public curve;

    modifier onlyDeployerOrCurve() {
        require(msg.sender == deployer || msg.sender == curve, "unauthorized address");
        _;
    }

    constructor(address _curve) 
    ERC20(
        "Collateral Token",
        "CLT"
    ) {
        deployer = msg.sender;
        curve = _curve;
    }

    function mint(address account, uint256 amount) public onlyDeployerOrCurve {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public onlyDeployerOrCurve {
        _burn(account, amount);
    }
}