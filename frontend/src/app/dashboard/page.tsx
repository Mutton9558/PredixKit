"use client";
import React, { useEffect, useState } from "react";
import SearchButtonWrapper from "../components/SearchButton";
import WalletButtonWrapper from "../components/WalletButton";
import { ethers, BrowserProvider } from "ethers";
import PredictionCard from "../components/PredictionCard";
import { useRouter } from "next/navigation";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "marketAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
    ],
    name: "MarketCreated",
    type: "event",
  },
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
        internalType: "uint256",
        name: "_endTime",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_creator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_yesPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_noPrice",
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
    name: "getAccumulatedAmount",
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
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getCreationDate",
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
    name: "getEndTime",
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
    name: "getNoDist",
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
    name: "getNoPrice",
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
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "getYesDist",
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
    name: "getYesPrice",
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

const Dashboard = () => {
  const router = useRouter();

  const [ongoingMarketList, setOngoingMarketList] = useState<any[]>([]);
  const [pastMarketList, setPastMarketList] = useState<any[]>([]);

  useEffect(() => {
    const address = localStorage.getItem("userAddress");
    if (!address) {
      router.push("/login");
      return;
    }

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

          const ongoing: any[] = [];
          const past: any[] = [];

          for (let i = 0; i < userMarkets.length; i++) {
            const marketAddress = await contract.getMarketAddressById(
              userMarkets[i]
            );
            const marketTitle = await contract.getTitle(marketAddress);
            console.log(marketTitle);
            const predictionMoney = await contract.getAccumulatedAmount(
              marketAddress
            );
            const marketTag = await contract.getTag(marketAddress);
            const marketEndTime = Number(
              await contract.getEndTime(marketAddress)
            );
            const now = Math.floor(Date.now() / 1000);

            const marketInfo = {
              Title: marketTitle,
              PredictionMoney: Number(predictionMoney),
              Tag: marketTag,
            };

            if (now <= marketEndTime) {
              ongoing.push(marketInfo);
            } else {
              past.push(marketInfo);
            }
          }

          setOngoingMarketList(ongoing);
          setPastMarketList(past);

          // optional: save to localStorage
          localStorage.setItem("ongoingMarkets", JSON.stringify(ongoing));
          localStorage.setItem("pastMarkets", JSON.stringify(past));
        }
      } catch (err: any) {
        console.log("Error linking frontend to smart contract", err);
      }
    };

    // load from localStorage first for instant display
    const storedOngoing = localStorage.getItem("ongoingMarkets");
    const storedPast = localStorage.getItem("pastMarkets");
    if (storedOngoing) setOngoingMarketList(JSON.parse(storedOngoing));
    if (storedPast) setPastMarketList(JSON.parse(storedPast));

    getMarkets();
  }, [router]);

  return (
    <>
      <div className="dashboard-bg">
        <header>
          <SearchButtonWrapper />
          <WalletButtonWrapper />
        </header>
        <div className="dashboard-content">
          <button
            className="create-btn"
            onClick={() => {
              router.push("/new-prediction/");
            }}
          >
            <span style={{ fontSize: "1.5em", marginRight: "0.5em" }}>+</span>
            Create New Prediction
          </button>

          <div className="section">
            <div className="section-title">Your Ongoing Predictions</div>
            <div className="section-inner">
              {ongoingMarketList.map((prediction, index) => (
                <PredictionCard
                  key={`ongoing-${index}`}
                  title={prediction.Title}
                  predictionMoney={prediction.PredictionMoney}
                  tag={prediction.Tag}
                />
              ))}
              {ongoingMarketList.length === 0 && (
                <div>No ongoing predictions</div>
              )}
              <div className="see-more">
                see more <span className="icon">&#8635;</span>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Your Past Predictions</div>
            <div className="section-inner">
              {pastMarketList.map((prediction, index) => (
                <PredictionCard
                  key={`past-${index}`}
                  title={prediction.Title}
                  predictionMoney={prediction.PredictionMoney}
                  tag={prediction.Tag}
                />
              ))}
              {pastMarketList.length === 0 && <div>No past predictions</div>}
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

export default Dashboard;
