// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CollateralToken.sol";

contract Curve {
    using SafeMath for uint256;

    CollateralToken private _token;
    IERC20 private _collateral;

    constructor(address collateralAddress, address tokenAddress) {
        _collateral = IERC20(collateralAddress);
        _token = CollateralToken(tokenAddress);
    }

    function collateralToken() public view returns (address) {
        return address(_collateral);
    }
    function bondedToken() public view returns (address) {
        return address(_token);
    }

    function buyPrice(uint256 _amount) public view returns(uint256) {
        uint256 supply = _token.totalSupply();
        return solve(supply.add(_amount), supply);
    }

    function sellReward(uint256 _amount) public view returns(uint256) {
        uint256 supply = _token.totalSupply();
        return solve(supply, supply.sub(_amount));
    }

    function mint(uint256 _amount) public returns (bool) {
        uint256 cost = buyPrice(_amount);
        require(_collateral.allowance(msg.sender, address(this)) >= cost, "mint: unauthorized amount");
        require(_collateral.transferFrom(msg.sender, address(this), _amount), "mint: transfer failed");

        _token.mint(msg.sender, _amount);
        return true;
    }

    function burn(uint256 _amount) public returns (bool) {
        uint256 reward = sellReward(_amount);
        require(_token.allowance(msg.sender, address(this)) >= _amount, "burn: unauthorized amount");
        _token.burn(msg.sender, _amount);

        require(_collateral.transfer(msg.sender, reward), "burn: burn failed");
        return true;
    }

    function solve(uint256 a, uint256 b) internal pure returns (uint256) {
          require(b > a);
          uint256 temp = ((b**2).sub(a**2)).add((b - a).mul(40));

          return temp / 200;
    }
}