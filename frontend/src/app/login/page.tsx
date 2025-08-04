'use client';
import React from 'react'
import { ethers } from 'ethers'
import Button from '../components/button'

const MetaMaskLogin = () => {
  const handleLogin = async () => {
    console.log('MetaMask login initiated');
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
            <h1 style={{ marginBottom: '0.5em'}}>Log in / Sign up</h1>
            <p style={{ fontSize: '1.25em'}}>Welcome onboard! <br /> Let's get you ready on your adventure with us.</p>
          </div>
          <MetaMaskLogin />
        </div>
      </div>
      
      <style jsx>{`
        .login-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: var(--login-bg-color)
        }

      .login {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 40vh;
        padding: 1em;
        gap: 10em;
        background-color: #f0f0f0;
        color: #333;
        border-radius: 1em;
      }
      `}</style>
    </>
  )
}

export default login