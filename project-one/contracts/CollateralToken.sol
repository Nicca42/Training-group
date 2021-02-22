// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CollateralToken is ERC20, Ownable {
    mapping (address => bool) private minters;

    event MinterAdded(address addedBy, address newMinter);
    event MinterYeeted(address yeetedBy, address yeetedMinter);

    modifier onlyAuthorized() {
        require(minters[msg.sender], "unauthorized address");
        _;
    }

    constructor() 
    ERC20("Test Token", "TST")
    Ownable() {
        minters[msg.sender] = true;
        /**
        FB Again, better to pass in the name and symbol than to hardcode. 
        Also you seem to have two Ownable implementations here, the OZ one,
        as well as a custom one you have created (onlyAuthorized).
        This can be dangerous, as they may conflict. 
        
        I can see that this is how you did it so that you have the Ownable from
        OZ being the only one who can add minters and remove them. 
        I'd recommend looking into the OZ AccessControl contract, as if you 
        are going to use the OZ infra its better to only use it. 
        Through the accessControl you could add a new role called super admin
        that is pretty much the openable contract but with elevated permissions.
        Don't be afraid to edit their contracts, you will often need more 
        functionality than they offer. 
         */
    }

    function isMinter(address toCheck) public view returns(bool) {
        return minters[toCheck];
    }

    function mint(address account, uint256 amount) public onlyAuthorized() {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public onlyAuthorized() {
        _burn(account, amount);
    }

    function addMinter(address newMinter) public onlyOwner {
        minters[newMinter] = true;
        emit MinterAdded(msg.sender, newMinter);
    }

    function removeMinter(address yeetedMinter) public onlyOwner {
        minters[yeetedMinter] = false;
        emit MinterYeeted(msg.sender, yeetedMinter);
    }
}