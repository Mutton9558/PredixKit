// ignition/modules/PredictionSystem.js
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PredictionSystem", (m) => {
  const market = m.contract("CreateMarket"); // First contract
  const factory = m.contract("MarketFactory", [/* constructor args */]); // Second contract

  return { market, factory };
});
