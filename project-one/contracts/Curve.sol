// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
import "./CollateralToken.sol";
import "./Token.sol";
import "../artifacts//@openzeppelin/contracts/math/SafeMath.sol"
contract Curve {
    using SafeMath for uint256;
    ERC20 internal collateralToken_;
    ERC20 internal ninjaToken_;

    constructor(address _token, address _collateralToken){
        ninjaToken_ = _token;
        collateralToken_ = _collateralToken;
    }

    function buyPrice(uint256 _amount) public view returns (uint256 collateralRequired) {
        require((ninjaToken_.totalSupply - amount > 0)
        uint256 b = ninjaToken_.totalSupply + amount;
        uint256 a = ninjaToken_.totalSupply;
        uint256 collateralRequired = ((b.mul(b) - a.mul(a)).add(b.sub(a))).div(200);
        return collateralRequired;
    }

    function sellReward(uint256 _amount) public view {
        uint256 b = ninjaToken_.totalSupply;
        uint256 a = ninjaToken_.totalSupply - amount;
        uint256 delta = ((b.mul(b) - a.mul(a)).add(b.sub(a))).div(200);
    }

    function collateralToken(uint256 _amount) public {}
    function bondedToken() public{}
    function buybondedTokenPrice(uint256 _amount) public {}
    function mint(uint256 _amount) internal{
    }
    function burn(uint256 _amount) internal{
    }
}