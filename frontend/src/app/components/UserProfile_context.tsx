'use client';
import React, { createContext, useState, useEffect, useContext, ReactNode, use } from "react";
import { BrowserProvider, formatEther } from 'ethers';

type UserContextType = {
  address: string | null;
  setAddress: (address: string | null) => void;
  balance: string | null;
  setBalance: (balance: string | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddressState] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const storedAddress = localStorage.getItem('userAddress');
    if (storedAddress) {
      setAddressState(storedAddress);
    }
  }, []);

  useEffect(() => {
    if (address) {
      refreshBalance();
    } else {
      setBalance(null);
    }
  }, [address]);

  const setAddress = (address: string | null) => {
    setAddressState(address);
    if (address) {
      localStorage.setItem('userAddress', address);
    } else {
      localStorage.removeItem('userAddress');
    }
  };

  const refreshBalance = async () => {
    if (address && typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const bal = await provider.getBalance(address);
        setBalance(formatEther(bal));
      } catch {
        setBalance(null);
      }
    }
  };

  return (
    <UserContext.Provider value={{ address, setAddress, balance, setBalance }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};