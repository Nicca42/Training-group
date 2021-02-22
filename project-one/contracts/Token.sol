// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    address _owner;
    uint256 _totalSupply;
    mapping(address => uint256) balances;
    mapping (address => bool) _minters;

    // FB shouldn't hardcode input variables. 
    constructor() ERC20(
        "Ninja Token",
        "NTK"
    ) {
        owner = msg.sender;
        _minters[msg.sender] = true;
        /**
        FB I like the way you have handled the original owner vs the minting
        owners. Consistent implementation. 
         */
    }


    modifier onlyMinter() {
        require(isMinter(_msgSender()), "Only minter accounts can mint");
        _;
    }
    modifier onlyOwner {
        require(msg.sender == _owner,"Only owner can add minters.");
        _;
    }
    function isMinter(address minter) public view returns (bool) {
        return _minters(minter);
    }
    function addMinter(address _minter) public onlyOwner{
        _minters[_minter] = true;

    }

    /**
    FB when a function is too long for one line like this (as per the solidity
    style guide, should only be 80 char a line) its best to break it up 
    like so:

    function mint(
        uint256 _amount, 
        address _to
    ) 
        public 
        onlyMinter 
        returns(bool)
    {
     */
    function mint(uint256 _amount, address _to) public onlyMinter returns(bool){
        _mint(_to, amount);
        return true;
    }

    function burn(uint256 _amount, address _from) public {
        _burn(_from, _amount);
    }
}