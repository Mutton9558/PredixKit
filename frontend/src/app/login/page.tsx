'use client';
import React from 'react'
import { ethers, BrowserProvider } from 'ethers'
import { useRouter } from 'next/navigation'
import { useUser } from '../components/UserProfile_context'
import Button from '../components/button'

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const MetaMaskLogin = () => {
  const router = useRouter();
  const { setAddress } = useUser();

  const handleLogin = async () => {
    console.log('MetaMask login initiated');
    const provider = new BrowserProvider(window.ethereum);
    try {
      // Request account access if needed
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balanceBigInt = await provider.getBalance(address);
      const balance = ethers.formatEther(balanceBigInt);
      console.log('Logged in with address:', address);
      setAddress(address);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error logging in with MetaMask:', error);
    }
  };

  return (
    <Button onClick={handleLogin} className='login-button'>
      Login using MetaMask
    </Button>
  );
}

const login = () => {
  return (
    <>
      <div className='login-container'>
        <div className='login'>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ marginBottom: '0.5em' }}>Log in / Sign up</h1>
            <p style={{ fontSize: '1.25em' }}>Welcome onboard! <br /> Let's get you ready on your adventure with us.</p>
          </div>
          <MetaMaskLogin />
        </div>
      </div>
    </>
  )
}

export default login