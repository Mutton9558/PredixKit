// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

uint256 constant DECIMALS = 100;
uint256 constant minPrice = 0.05 ether;

contract CreateMarket {
    string public title;
    string public tag;
    uint public cutOffTime;
    address public creator;
    uint public price;
    uint public profitMultiplier;
    uint public yesTotal = 0;
    uint public noTotal = 0;
    address[] public voters;
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
        price = _price > minPrice ? _price : minPrice;
        profitMultiplier = _profitMultiplier / DECIMALS;
    }

    // token things might be switched to factory idk lmfao
    function buyYesTokens() external payable {
        require(block.timestamp < cutOffTime, "Betting closed");
        require(msg.value > 0, "Send ETH");

        yesToken[msg.sender] += (msg.value / price);
        voters.push(msg.sender);
        yesTotal += (msg.value / price);
    }

    function buyNoTokens() external payable {
        require(block.timestamp < cutOffTime, "Betting closed");
        require(msg.value > 0, "Send ETH");

        noToken[msg.sender] += (msg.value / price);
        voters.push(msg.sender);
        noTotal += (msg.value / price);
    }

    function sellTokens(uint sellAmount) external payable {
        require(address(this).balance >= sellAmount, "I'm broke");
        uint returnVal = sellAmount * price;
        payable(msg.sender).transfer(returnVal);
    }

    function prizeDistribution(bool decision) external payable {
        uint prizeMoney = price * profitMultiplier;
        for (uint i = 0; i < voters.length; i++) {
            if (decision == true) {
                if (yesToken[voters[i]] > 0) {
                    payable(voters[i]).transfer(prizeMoney);
                }
            } else {
                if (noToken[voters[i]] > 0) {
                    payable(voters[i]).transfer(prizeMoney);
                }
            }
        }
    }
}
