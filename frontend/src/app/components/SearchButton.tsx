'use client';
import React, { useState } from 'react';
import Button from "./button";

const SearchIcon = () => (
  <svg
    width={28}
    height={28}
    fill='none'
    viewBox='0 0 28 28'
    style={{ display: 'block' }}
  >
    <path
      d="M26 26L20.2 20.2M23.3333 12.6667C23.3333 18.5577 18.5577 23.3333 12.6667 23.3333C6.77563 23.3333 2 18.5577 2 12.6667C2 6.77563 6.77563 2 12.6667 2C18.5577 2 23.3333 6.77563 23.3333 12.6667Z"
      stroke="#1E1E1E"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchButton = ({ onClick }: { onClick: () => void }) => (
  <div className="search-button-container">
    <Button onClick={onClick} className='search-button'>
      <SearchIcon />
    </Button>
  </div>
);

const SearchButtonExtended = ({ onClose }: { onClose: () => void }) => (
  <div className="search-button-extended">
    <Button onClick={onClose} className='search-button'>
      <SearchIcon />
    </Button>
    <input style={{ marginLeft: '8px', color: '#1E1E1E' }} placeholder="Search..." />
  </div>
);

const SearchButtonWrapper = () => {
  const [showExtended, setShowExtended] = useState(false);

  return (
    <>
      {!showExtended && <SearchButton onClick={() => setShowExtended(true)} />}
      {showExtended && <SearchButtonExtended onClose={() => setShowExtended(false)} />}
    </>
  );
}

export default SearchButtonWrapper