'use client';
import React from 'react';
import Button from "./button";
import { useUser } from './UserProfile_context';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';

function shortenAddress(address: string | null): string {
  if (!address) return '';
  return `${address.slice(0, 7)}...${address.slice(-5)}`;
}

interface WalletButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: () => void;
}

const WalletButton: React.FC<WalletButtonProps> = ({ children, onClick }) => {
  const { address, balance } = useUser();

  return (
    <div className='wallet-button-container'>
      <Button onClick={onClick} className='user-button'>
        <div className='wallet-icon'>
          <h4>{shortenAddress(address)}</h4>
          <p>{balance !== null ? `${balance} ETH` : 'Fetching balance...'}</p>
        </div>
        {children}
      </Button>
    </div>
  );
};

const WalletDropdown = () => {
  const router = useRouter();
  const HandleLogout = () => {
    router.push('/logout');
  };

  return (
    <div className='wallet-dropdown'>
      <button className='marketplace-button' onClick={() => router.push('/marketplace')}>
        Marketplace
      </button>
      <button className='logout-button' onClick={HandleLogout}>
        Logout
      </button>
    </div>
  );
};

const WalletButtonWrapper = () => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  return (
    <>
      <div className='wallet-button-wrapper'>
        <WalletButton onClick={() => setShowDropdown(!showDropdown)}>
          <div>
            {showDropdown ? '▲' : '▼'}
          </div>
        </WalletButton>
        {showDropdown && <WalletDropdown />}
      </div>
    </>
  );
};

export default WalletButtonWrapper;