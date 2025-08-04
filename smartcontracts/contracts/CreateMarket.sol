// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract CreateMarket {
    string public title;
    uint public cutOffTime;
    address public creator;

    constructor(string memory _title, uint _cutOffTime, address _creator) {
        title = _title;
        cutOffTime = _cutOffTime;
        creator = _creator;
    }
}
