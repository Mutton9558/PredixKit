// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./CreateMarket.sol";

contract MarketFactory {
    uint public marketCount = 0;

    mapping(address => uint[]) public userMarkets;
    mapping(uint => address) public markets;
    function storeNewMarket(address creator, address market) public {
        markets[marketCount] = market;
        userMarkets[creator].push(marketCount);
        marketCount++;
    }

    function createMarket(
        string memory _title,
        string memory _tag,
        uint _cutOffTime,
        address _creator,
        uint _price,
        uint _profitMultiplier
    ) external payable {
        CreateMarket newMarket = new CreateMarket(
            _title,
            _tag,
            _cutOffTime,
            _creator,
            _price,
            _profitMultiplier
        );
        storeNewMarket(_creator, address(newMarket));
    }

    // why are solidity maps not build for iterations ;-;
    function getMarkets(address _sender) external view returns (uint[] memory) {
        return userMarkets[_sender];
    }

    // function sendData(address market) external view returns (string[] memory) {
    //     CreateMarket existingMarket = CreateMarket(market);
    // }
}
