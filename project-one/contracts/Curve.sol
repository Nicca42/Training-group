pragma solidity ^0.7.0;

import "./Token.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Curve {
    IERC20 internal token;
    IERC20 internal collateral;

    constructor(address _token, address _collateral) {
        token = IERC20(_token);
        collateral = IERC20(_collateral);
    }

    function buyPrice(uint _amount) public view returns(uint256) {
        return curveIntegral(token.totalSupply(), token.totalSupply() + _amount);
    }

    function sellReward(uint _amount) public view returns(uint256) {
        return curveIntegral(token.totalSupply() - _amount, token.totalSupply());
    }

    function collateralToken() public view returns(address) {
        return address(collateral);
    }

    function bondedToken() public view returns(address) {
        return address(token);
    }

    function mint(address account, uint256 amount) public onlyOwner{
        _mint(account, amount);
    }

    function curveIntegral(uint _amount) public view returns(uint256) {
        return curveIntegral(token.totalSupply(), token.totalSupply() + _amount);
    }

    // function mint(address account, uint256 amount) public onlyOwner{
    //     _mint(account, amount);
    // }

    // function burn(address account, uint256 amount) public onlyOwner {
    //     _burn(account, amount);
    // }
}