// we gon use graphjs for this
"use client";
import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider, JsonRpcSigner } from "ethers";

interface marketProp {
  id: number;
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const ABI: any = process.env.NEXT_PUBLIC_ABI;

const odds: React.FC<marketProp> = ({ id }) => {
  const [betCount, setBetCount] = useState(0);
  useEffect(() => {
    const connectSmartContract = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        if (CONTRACT_ADDRESS) {
          const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
          const marketAddress = await contract.getMarketAddressById(id);
          const totalYes: number = await contract.getYesAmount(marketAddress);
          const totalNo: number = await contract.getNoAmount(marketAddress);
          const totalBets: number = totalYes + totalNo;
          setBetCount(totalBets);
        }
      } catch (err: any) {
        console.log("Error linking frontend to smart contract");
      }
    };
  }, []);

  return (
    <div>
      <h1>Graph here</h1>
      <h2>Bet count: {betCount}</h2>
    </div>
  );
};

export default odds;
