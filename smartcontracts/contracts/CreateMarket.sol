// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

uint256 constant DECIMALS = 100;

contract CreateMarket {
    string public title;
    string public tag;
    uint public cutOffTime;
    address public creator;
    uint public price;
    uint public profitMultiplier;
    mapping(address => uint256) public yesToken;
    mapping(address => uint256) public noToken;

    constructor(
        string memory _title,
        string memory _tag,
        uint _cutOffTime,
        address _creator,
        uint _price,
        uint _profitMultiplier
    ) {
        title = _title;
        tag = _tag;
        cutOffTime = _cutOffTime;
        creator = _creator;
        price = _price;
        profitMultiplier = _profitMultiplier;
    }

    function buyYesTokens() external payable {
        require(block.timestamp < cutOffTime, "Betting closed");
        require(msg.value > 0, "Send ETH");

        yesToken[msg.sender] += (msg.value / price);
    }

    function buyNoTokens() external payable {
        require(block.timestamp < cutOffTime, "Betting closed");
        require(msg.value > 0, "Send ETH");

        noToken[msg.sender] += (msg.value / price);
    }

    function sellTokens(uint sellAmount) external payable {
        require(address(this).balance >= sellAmount, "I'm broke");
        payable(msg.sender).transfer(sellAmount);
    }
}
