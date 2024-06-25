import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Modal from 'react-modal';
import './App.css';  // Import the CSS file

Modal.setAppElement('#root');

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await loadWeb3();
      await loadBlockchainData();
    };
    initialize();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error('User denied account access');
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      setModalIsOpen(true);
    }
  };

  const loadBlockchainData = async () => {
    if (!window.web3) {
      return;
    }
    const web3 = window.web3;
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        setModalIsOpen(true);
      } else {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error fetching accounts', error);
      setModalIsOpen(true);
    }
  };

  const handleLogin = async () => {
    await loadWeb3();
    await loadBlockchainData();
  };

  const handleRetry = async () => {
    setModalIsOpen(false);
    await loadBlockchainData();
  };

  const handleCreateAccount = () => {
    window.open('https://metamask.io/download.html', '_blank');
  };

  const handleLogout = () => {
    alert('To fully disconnect, please manually disconnect from MetaMask.');
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <div>
      <h2>Welcome to</h2> 
      <h1>  B-LOCK</h1> 
      <h2>a blockchain based e-vault</h2>
      {isLoggedIn ? (
        <>
          <p>Successfully logged in</p>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <p>Please log in with MetaMask</p>
          <button onClick={handleLogin}>Login with MetaMask</button>
        </>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="MetaMask Not Detected"
      >
        <h2>MetaMask Not Detected</h2>
        <p>MetaMask is not installed or no accounts found. Please install MetaMask or try again.</p>
        <button className="try-again" onClick={handleRetry}>Try Again</button>
        <button className="create-account" onClick={handleCreateAccount}>Install MetaMask</button>
      </Modal>
    </div>
  );
}

export default App;