// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

	address private _owner;
	address{} private _minters;

    constructor() 
    ERC20(
        "G-Money Token",
        "GMT"
    ) {
		_minters.push(msg.sender);

	modifier isMinter {
		// WTF is a soidity method like .has in javascript ????/ FUUUUJUCLKKJWEFHKLAEFGBKLAE
        require(_minters);
    }	
	modifier isOwner {
		require(msg.sender == _owner);
	}

    }
    function mint((uint256 _amount, address _to) public isMinter  {
        _mint(_to, _amount);

    }

    function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }

	function addMinter(address _minter) public isMinter {
		_minters.push(address);
	}
}