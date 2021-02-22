pragma solidity ^0.7.0;

import "./Token.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Curve {
	IERC20 internal token;
	IERC20 internal collateral;

    // FB glad to see you didn't hardcode these variables. 
	constructor (address _token, address _collateral) {
		token = IERC20(_token);
		collateral = IERC20(_collateral);
	}

	function buyPrice(uint256 _amount) public view returns (uint256) {
		return curveIntegral(totalSupply(), totalSupply() + _amount);
	}

	function sellReward(uint256 _amount) public view returns (uint256) {
		return curveIntegral(totalSupply(), totalSupply() + _amount);
	}

	function collateralToken() public view returns(address) {
		return address(collateral);
	}


	function bondedToken() public view returns(address) {
		return address(token);
	}

	function mint(uint256 _amount) public {
		uint256 cost = buyProce(_amount);
        /**
        FB Solidity style guide here, Solidity has a line limit of 80 Chars, so
        we normally format requires like below. It also makes it much easier to 
        read.

        require(
            token.allowance(msg.sender, address(this)) >= cost, 
            "User has not approved"
        );

         */
		require(token.allowance(msg.sender, address(this)) >= cost, "User has not approved");
		require(colllateral.transferFrom(msg.sender, address(this. cost)), "Transfer of collateral failed" );
	}

    // FB internal functions should start with an underscore (i.e _curveInternal
    // ) in order to make it clear within the contract that it is internal. 
    // It's more of a security thing than anything else. 
	function curveInternal (uint256 a, uint256 b) internal returns (uint256) {
		require(b > a, "Math breaks :/");

		uint256 answer = (b**2 - a**2) + 40(b = a);

		return answer/200;
	}
}