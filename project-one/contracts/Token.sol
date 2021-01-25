// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    mapping(address => bool) minters;
    address internal original;

    constructor() ERC20("Token", "TKR") {
        minters[msg.sender] = true;
        original = msg.sender;
    }

    modifier isMinter() {
        require(
            minters[msg.sender],
            "Caller must be minter"
        );
        _;
    }

    modifier isOriginal() {
        require(
            msg.sender == original,
            "Caller must be minter"
        );
        _;
    }

    function addMinter(address _newMinter) public isOriginal() {
        minters[_newMinter] = true;
    }

    function mint(uint256 _amount, address _to) public isMinter() {
        _mint(_to, _amount);
    }

    function burn(uint256 _amount, address _to) public isMinter() {
        _burn(_to, _amount);
    }

}