// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CollateralToken is ERC20, Ownable {
    mapping (address => bool) private minters;

    modifier onlyAuthorized() {
        require(members[msg.sender], "unauthorized address");
        _;
    }

    constructor(address _curve) 
    ERC20("Collateral Token", "CLT")
    Ownable() {
        minters[msg.sender] == true;
        minters[_curve] == true;
    }

    function mint(address account, uint256 amount) public onlyAuthorized() {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public onlyAuthorized() {
        _burn(account, amount);
    }

    function addMinter(address newMinter) public onlyOwner {
        minters[newMinter] = true;
    }
}