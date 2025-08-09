// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

uint256 constant minPrice = 0.05 ether;

contract CreateMarket {
    string public title;
    string public tag;
    uint public cutOffTime;
    uint public endTime;
    uint public creationDate;
    address public creator;
    uint public yesPrice;
    uint public noPrice;
    uint public yesTotal = 0;
    uint public noTotal = 0;
    uint[] public yesByTime;
    uint[] public noByTime;
    address[] public voters;
    address public marketOwner;
    bool closed = false;
    mapping(address => uint256) public yesToken;
    mapping(address => uint256) public noToken;

    constructor() {
        marketOwner = msg.sender;
        creationDate = block.timestamp;
    }

    modifier onlyOwner() {
        require(msg.sender == marketOwner, "Not market owner");
        _;
    }

    function createMarket(
        string memory _title,
        string memory _tag,
        uint _cutOffTime,
        uint _endTime,
        address _creator,
        uint _yesPrice,
        uint _noPrice
    ) public {
        title = _title;
        tag = _tag;
        cutOffTime = _cutOffTime;
        endTime = _endTime;
        creator = _creator;
        yesPrice = _yesPrice > minPrice ? _yesPrice : minPrice;
        noPrice = _noPrice > minPrice ? _noPrice : minPrice;
    }

    function _ensureLengthUintArray(uint[] storage arr, uint index) internal {
        while (arr.length <= index) {
            arr.push(0);
        }
    }

    // token things might be switched to factory idk lmfao
    function buyYesTokens() external payable {
        require(block.timestamp < cutOffTime, "Betting closed");
        require(msg.value > yesPrice, "Send ETH");

        yesToken[msg.sender] += (msg.value / yesPrice);
        voters.push(msg.sender);
        yesTotal += (msg.value / yesPrice);

        // I am piratesoftware
        uint index;
        if ((endTime - creationDate) <= 86400) {
            index = (block.timestamp - creationDate) / 3600;
            _ensureLengthUintArray(yesByTime, index);
            yesByTime[index] = yesTotal;
        } else {
            index = (block.timestamp - creationDate) / 86400;
            _ensureLengthUintArray(yesByTime, index);
            yesByTime[index] = yesTotal;
        }
    }

    function buyNoTokens() external payable {
        require(block.timestamp < cutOffTime, "Betting closed");
        require(msg.value > noPrice, "Send ETH");

        noToken[msg.sender] += (msg.value / noPrice);
        voters.push(msg.sender);
        noTotal += (msg.value / noPrice);

        uint index;
        if ((endTime - creationDate) <= 86400) {
            index = (block.timestamp - creationDate) / 3600;
            _ensureLengthUintArray(noByTime, index);
            noByTime[index] = noTotal;
        } else {
            index = (block.timestamp - creationDate) / 86400;
            _ensureLengthUintArray(noByTime, index);
            noByTime[index] = noTotal;
        }
    }

    function sellTokens(uint sellAmount) external payable {
        require(address(this).balance >= sellAmount, "I'm broke");
        uint returnVal = sellAmount * noPrice;
        payable(msg.sender).transfer(returnVal);
    }

    function prizeDistribution(bool decision) external payable {
        require(closed, "Prediction Market opened");
        uint balance = address(this).balance;
        uint prizeMoney = (balance * 9) / 10;
        require(address(this).balance >= prizeMoney, "I'm broke");
        for (uint i = 0; i < voters.length; i++) {
            if (decision == true) {
                uint userTokens = yesToken[voters[i]];
                require(yesTotal > 0, "No Winners");
                if (userTokens > 0) {
                    payable(voters[i]).transfer(
                        (prizeMoney / yesTotal) * userTokens
                    );
                }
            } else {
                uint userTokens = noToken[voters[i]];
                require(noTotal > 0, "No Winners");
                if (userTokens > 0) {
                    payable(voters[i]).transfer(
                        (prizeMoney / noTotal) * userTokens
                    );
                }
            }
            yesToken[voters[i]] = 0;
            noToken[voters[i]] = 0;
        }

        payable(creator).transfer(address(this).balance);
    }

    function getYesByTime() external view returns (uint[] memory) {
        return yesByTime;
    }

    function getNoByTime() external view returns (uint[] memory) {
        return noByTime;
    }
}
