// ignition/modules/PredictionSystem.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PredictionSystem", (m) => {
  const market = m.contract("CreateMarket", []);
  const factory = m.contract("MarketFactory", []);
  return { market, factory };
});
