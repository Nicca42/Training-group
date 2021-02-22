// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

	address owner;
	mapping(address => bool) minters;

    // FB tisk tisk, shouldn't hardcode inputs. 
    constructor() 
    ERC20(
        "G-Money Token",
        "GMT"
    ) {
        /**
        FB, I like how you have handled the original minter vs the other 
        minters. Nice simple and consistent implementation. 
         */
		minters[msg.sender] = true;
		owner = msg.sender;
	}

	modifier isMinter() {
        require(minters[msg.sendder], "Caller must be a minter");
		_;
    }	
	modifier isOwner() {
		require(msg.sender == _owner);
        // FB contracts don't compile because of a missing _; here.

        /**
        FB also using _owner, when you have only created a owner variable 
        without the underscore. I prefer making state variables with the 
        underscore, but either way it needs to be consistent. 

        Otherwise good effort considering how busy you where this week. Would
        have love to seen some tests, but not the end of the world. 
         */
	}

    
    function mint(uint256 _amount, address _to) public isMinter  {
        _mint(_to, _amount);
    }

    function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }

    // FB Only the owner should be able to add new minters. 
	function addMinter(address _minter) public isMinter {
		_minters.push(address);
	}
}