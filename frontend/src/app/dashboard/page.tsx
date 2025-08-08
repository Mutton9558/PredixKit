"use client";
import React from "react";
import { useEffect } from "react";
import { useUser } from "../components/UserProfile_context";
import SearchButtonWrapper from "../components/SearchButton";
import WalletButtonWrapper from "../components/WalletButton";
import { ethers, BrowserProvider, JsonRpcSigner } from "ethers";
import PredictionCard from "../components/PredictionCard";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_tag",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_cutOffTime",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_creator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "createMarket",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getCOT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getMarketAddressById",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getNoAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getTag",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getTitle",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
    ],
    name: "getUserMarkets",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getYesAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "marketCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "markets",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "storeNewMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userMarkets",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

let ongoingMarketList: any[] = [];
let pastMarketList: any[] = [];

const dashboard = () => {
  const address = localStorage.getItem("userAddress");
  useEffect(() => {
    const getMarkets = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        if (CONTRACT_ADDRESS) {
          const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
          const network = await provider.getNetwork();
          if (Number(network.chainId) !== 31337) {
            throw new Error("Switch MetaMask to Hardhat local network");
          }
          const userMarkets = await contract.getUserMarkets(address);

          for (let i = 0; i < userMarkets.length; i++) {
            let marketAddress = await contract.getMarketAddressById(
              userMarkets[i]
            );
            let marketTitle = await contract.getTitle(marketAddress);
            let marketPrice = await contract.getPrice(marketAddress);
            let marketTag = await contract.getTag(marketAddress);
            let marketCutOffTime = Number(await contract.getCOT(marketAddress));
            let now = Math.floor(Date.now() / 1000);
            let marketInfo = {
              Title: marketTitle,
              Price: marketPrice,
              Tag: marketTag,
            };

            if (now <= marketCutOffTime) {
              ongoingMarketList.push(marketInfo);
            } else if (now > marketCutOffTime) {
              pastMarketList.push(marketInfo);
            } else {
              console.log("Error getting time");
            }
          }
        }
      } catch (err: any) {
        console.log("Error linking frontend to smart contract", err);
      }
    };
    getMarkets();
  }, []);
  return (
    <>
      <div className="dashboard-bg">
        <header>
          <SearchButtonWrapper />
          <WalletButtonWrapper />
        </header>
        <div className="dashboard-content">
          <button className="create-btn">
            <span style={{ fontSize: "1.5em", marginRight: "0.5em" }}>+</span>
            Create New Prediction
          </button>
          <div className="section">
            <div className="section-title">Your Ongoing Predictions</div>
            <div className="section-inner">
              {ongoingMarketList.map((prediction) => (
                <PredictionCard
                  title={prediction.Title}
                  price={prediction.Price}
                  tag={prediction.Tag}
                />
              ))}
              <div className="see-more">
                see more <span className="icon">&#8635;</span>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section-title">Your Past Predictions</div>
            <div className="section-inner">
              {pastMarketList.map((prediction) => (
                <PredictionCard
                  title={prediction.Title}
                  price={prediction.Price}
                  tag={prediction.Tag}
                />
              ))}
              <div className="see-more">
                see more <span className="icon">&#8635;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default dashboard;
