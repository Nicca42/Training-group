// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./Token.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Curve {
    Token internal token;
    IERC20 internal collateral;

    constructor(address _token, address _collateral) {
        token = Token(_token);
        collateral = IERC20(_collateral);
    }

    function buyPrice(uint256 _amount) public view returns(uint256) {
        return curveIntegral(token.totalSupply(), token.totalSupply() + _amount);
    }

    function sellReward(uint256 _amount) public view returns(uint256) {
        return curveIntegral(token.totalSupply() - _amount, token.totalSupply());
    }

    function collateralToken() public view returns(address) {
        return address(collateral);
    }

    function bondedToken() public view returns(address) {
        return address(token);
    }

    function mint(uint256 _amount) public returns(bool){
        uint256 cost = buyPrice(_amount);
        
        require(
            collateral.allowance(msg.sender, address(this)) >= cost,
            "User has not approved"
        );
        require(
            collateral.transferFrom(
                msg.sender,
                address(this),
                cost
            ),
            "Transfer of collateral failed"
        );

        token.mint( _amount, msg.sender);
        
        return true;
    }

    function burn(uint256 _amount) public returns(bool) {
        uint256 reward = sellReward(_amount);

        token.burn(_amount, msg.sender);

        require(
            collateral.transfer(
                msg.sender,
                reward
            ),
            "Transfer of collateral failed"
        );
    }

    function curveIntegral(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > a, "Math breaks :/");

        uint256 answer = (b**2 - a**2) + 40*(b - a);

        return answer/200;
    }
}