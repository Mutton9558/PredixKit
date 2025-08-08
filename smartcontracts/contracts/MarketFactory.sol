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
        uint _price
    ) external payable {
        CreateMarket newMarket = new CreateMarket();
        newMarket.createMarket(_title, _tag, _cutOffTime, _creator, _price);
        storeNewMarket(_creator, address(newMarket));
    }

    // why are solidity maps not build for iterations ;-;
    function getUserMarkets(
        address _sender
    ) external view returns (uint[] memory) {
        return userMarkets[_sender];
    }

    // plan is, get the count, loop in frontend retrieving data in each loop
    function getCount() external view returns (uint) {
        return marketCount;
    }

    function getMarketAddressById(uint _id) external view returns (address) {
        return markets[_id];
    }

    function getTitle(address market) external view returns (string memory) {
        CreateMarket indexedMarket = CreateMarket(market);
        return indexedMarket.title();
    }

    function getTag(address market) external view returns (string memory) {
        CreateMarket indexedMarket = CreateMarket(market);
        return indexedMarket.tag();
    }

    function getCOT(address market) external view returns (uint) {
        CreateMarket indexedMarket = CreateMarket(market);
        return indexedMarket.cutOffTime();
    }

    function getPrice(address market) external view returns (uint) {
        CreateMarket indexedMarket = CreateMarket(market);
        return indexedMarket.price();
    }

    function getYesAmount(address market) external view returns (uint) {
        CreateMarket indexedMarket = CreateMarket(market);
        return indexedMarket.yesTotal();
    }

    function getNoAmount(address market) external view returns (uint) {
        CreateMarket indexedMarket = CreateMarket(market);
        return indexedMarket.noTotal();
    }
}
