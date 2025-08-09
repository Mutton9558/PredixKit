// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
import "hardhat/console.sol";

import "./CreateMarket.sol";

contract MarketFactory {
    uint public marketCount = 0;

    mapping(address => uint[]) public userMarkets;
    mapping(uint => address) public markets;
    event MarketCreated(
        address indexed creator,
        address marketAddress,
        uint marketId
    );

    function storeNewMarket(address creator, address market) public {
        markets[marketCount] = market;
        userMarkets[creator].push(marketCount);
        emit MarketCreated(creator, market, marketCount);
        marketCount++;
    }

    function createMarket(
        string memory _title,
        string memory _tag,
        uint _cutOffTime,
        uint _endTime,
        address _creator,
        uint _yesPrice,
        uint _noPrice
    ) external payable {
        CreateMarket newMarket = new CreateMarket();
        newMarket.createMarket(
            _title,
            _tag,
            _cutOffTime,
            _endTime,
            _creator,
            _yesPrice,
            _noPrice
        );
        console.log("Success");
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

    function getYesPrice(address market) external view returns (uint) {
        CreateMarket indexedMarket = CreateMarket(market);
        return indexedMarket.yesPrice();
    }

    function getNoPrice(address market) external view returns (uint) {
        CreateMarket indexedMarket = CreateMarket(market);
        return indexedMarket.noPrice();
    }

    function getYesAmount(address market) external view returns (uint) {
        CreateMarket indexedMarket = CreateMarket(market);
        return indexedMarket.yesTotal();
    }

    function getNoAmount(address market) external view returns (uint) {
        CreateMarket indexedMarket = CreateMarket(market);
        return indexedMarket.noTotal();
    }

    function getAccumulatedAmount(address market) external view returns (uint) {
        return address(market).balance;
    }

    function getCreationDate(address market) external view returns (uint) {
        CreateMarket indexedMarket = CreateMarket(market);
        return indexedMarket.creationDate();
    }

    function getEndTime(address market) external view returns (uint) {
        CreateMarket indexedMarket = CreateMarket(market);
        return indexedMarket.endTime();
    }

    function getYesDist(address market) external view returns (uint[] memory) {
        CreateMarket indexedMarket = CreateMarket(market);
        return indexedMarket.getYesByTime();
    }

    function getNoDist(address market) external view returns (uint[] memory) {
        CreateMarket indexedMarket = CreateMarket(market);
        return indexedMarket.getNoByTime();
    }
}
