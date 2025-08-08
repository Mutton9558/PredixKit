// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");

/** @type import("hardhat/config").HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337, // Default for Hardhat local network
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    // Optional: add Goerli or Sepolia here for public testnets
    // sepolia: {
    //   url: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`,
    //   accounts: [`0x${PRIVATE_KEY}`]
    // }
  },
  solidity: "0.8.28",
};
