const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MarketFactory & CreateMarket integration", function () {
  let MarketFactory, marketFactory, owner, addr1, addr2, marketAddress, marketInstance;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    MarketFactory = await ethers.getContractFactory("MarketFactory");
    marketFactory = await MarketFactory.deploy();
  });

  it("Should create a market and allow token purchases", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const cutOff = now + 3600;
    const endTime = now + 7200;

    // Create market via factory
    const tx = await marketFactory.createMarket(
      "Will Lee Zi Jia win?",
      "Sports",
      cutOff,
      endTime,
      owner.address,
      ethers.parseEther("0.1"),
      ethers.parseEther("0.1")
    );
    await tx.wait();

    expect(await marketFactory.getCount()).to.equal(1);

    marketAddress = await marketFactory.getMarketAddressById(0);
    marketInstance = await ethers.getContractAt("CreateMarket", marketAddress);

    expect(await marketFactory.getTitle(marketAddress)).to.equal("Will Lee Zi Jia win?");
    expect(await marketFactory.getTag(marketAddress)).to.equal("Sports");

    await marketInstance.connect(addr1).buyYesTokens({
      value: ethers.parseEther("0.5"),
    });

    await marketInstance.connect(addr2).buyNoTokens({
      value: ethers.parseEther("0.3"),
    });

    expect(await marketInstance.yesToken(addr1.address)).to.equal(5);
    expect(await marketInstance.noToken(addr2.address)).to.equal(3);

    expect(await marketInstance.yesTotal()).to.equal(5);
    expect(await marketInstance.noTotal()).to.equal(3);

    const contractBal = await ethers.provider.getBalance(marketAddress);
    expect(contractBal).to.equal(ethers.parseEther("0.8"));
    if (contractBal === ethers.parseEther("0.8")) {
        console.log("correct balance");
    } else {
        console.log("wrong balance");
    }
    const dataYes = await marketFactory.getYesDist(marketAddress);
    const dataNo = await marketFactory.getNoDist(marketAddress);
    console.log(dataYes);
    console.log(dataNo);
  });
});
