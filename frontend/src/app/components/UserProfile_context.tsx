'use client';
import React, { createContext, useState, useEffect, useContext, ReactNode, use } from "react";

type UserContextType = {
  address: string | null;
  setAddress: (address: string | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddressState] = useState<string | null>(null);

  useEffect(() => {
    const storedAddress = localStorage.getItem('userAddress');
    if (storedAddress) {
      setAddressState(storedAddress);
    }
  }, []);

  const setAddress = (address: string | null) => {
    setAddressState(address);
    if (address) {
      localStorage.setItem('userAddress', address);
    } else {
      localStorage.removeItem('userAddress');
    }
  };

  return (
    <UserContext.Provider value={{ address, setAddress }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};