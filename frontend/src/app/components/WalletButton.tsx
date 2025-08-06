'use client';
import React from 'react';
import Button from "./button";
import { useUser } from './UserProfile_context';

function shortenAddress(address: string | null): string {
  if (!address) return '';
  return `${address.slice(0, 7)}...${address.slice(-5)}`;
}

const Page = () => {
  const { address, balance } = useUser();

  return (
    <div className='wallet-button-container'  >
      <Button onClick={() => console.log('Button clicked!')} className='user-button'>
        <h4>{shortenAddress(address)}</h4>
        <p>{balance !== null ? `${balance} ETH` : 'Fetching balance...'}</p>
      </Button>
    </div>
  );
};

export default Page;