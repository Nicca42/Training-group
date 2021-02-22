// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
import "./CollateralToken.sol";
import "./Token.sol";
import "../artifacts//@openzeppelin/contracts/math/SafeMath.sol"
import "../artifacts//@openzeppelin/contracts/token/IERC20.sol"
// FB pretty sure that double backslash will break things. 
// When importing from the node modules you can just start with the @ of the 
// package. 

contract Curve {
    using SafeMath for uint256;
    address internal collateralToken_;
    address internal ninjaToken_;

    constructor(address _token, address _collateralToken){
        ninjaToken_ = IERC20(_token);
        collateralToken_ = IERC20(_collateralToken);
        /**
        FB Yay! Glad to see you just casting the two tokens to an interface 
        and not importing the whole contract. 
        One issue here though, is that your token contract has a mint function,
        which the IEC20 standard does not have. So if you tried to call mint
        on either of these tokens, it would fail :/ 
         */
    }

    // FB internal functions should go at the end of the contract, and should
    // also start with an underscore. 
    function curveIntergral(uint256 a,uint256 b) internal returns(uint256){
        require(b > a, "Math breaks :/");
        uint256 delta = ((b.mul(b) - a.mul(a)).add(40.mul(b.sub(a)))).div(200);
        return delta
    }
    function buyPrice(uint256 _amount) public view returns (uint256 collateralRequired) {
        uint256 b = ninjaToken_.totalSupply + amount;
        uint256 a = ninjaToken_.totalSupply;

        uint256 collateralRequired = curveIntergral(a,b);
        return collateralRequired;
    }

    function sellReward(uint256 _amount) public view {
        uint256 b = ninjaToken_.totalSupply;
        uint256 a = ninjaToken_.totalSupply - amount;

        uint256 collateralRequired = curveIntergral(a,b);
        return collateralRequired;
    }

    function collateralToken(uint256 _amount) public view returns(address) {
        return address(collateralToken_);
    }

    function bondedToken() public view returns(address){
        return address(token_);
    }

    // FB public functions should be above all view / pure functions. 
    function mint(uint256 _amount) public returns(bool){
        uint256 cost = buyPrice(_amount);
        /**
        FB Require messages are easier to read when formatted as such:

        require(
            collateral.allowance(msg.sender, address(this))>=cost, 
            "User has not approved"
        );

         */
        require(collateral.allowance(msg.sender, address(this))>=cost, "User has not approved");
        require(collateral.trasnferFrom(msg.sender, address(this),cost),"Transfer of collateral failed");
        token.mint(msg.sender, _amount);
        return true
    }

    // FB Not sure why this function is internal, that means that users would
    // not be able to call this function. 
    function burn(uint256 _amount) internal{
        uint256 reward = sellReward(_amount)
        token.burn(_amount, msg.sender);
        require(collateral.transfer(msg.sender,reward),"Transfer of collateral failed");
        return true;
    }
}