import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const ResumeNFTContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const resumeContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  //   console.log({ provider, signer, resumeContract });

  return resumeContract;
};

export const ResumeProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [formData, setFormData] = useState({
    addressTo: '',
    message: '',
    keyword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert('Please install metamask');

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log('No accounts found');
      }

      console.log(accounts);
    } catch (error) {
      console.log(error);

      throw new Error('No ethereum object ');
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please install metamask');

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error('No ethereum object ');
    }
  };

  const mintResume = async () => {
    try {
      if (!ethereum) return alert('Please install metamask');

      const { addressTo, keyword, message } = formData;

      const resumeContract = getEthereumContract();

      const mintedResume = await resumeContract.makeAnEpicResume(
        JSON.stringify({
          name: 'ResumeNFT',
          description: 'An NFT from the highly acclaimed square collection',
          image:
            'https://gateway.pinata.cloud/ipfs/QmNfmcRav6zzvHL3gkYaNj8rJGMtZvWSkSF6HrDq7Gz52t',
        })
      );

      setIsLoading(true);
      console.log(mintedResume);
      await mintedResume.wait();
      setIsLoading(false);
      console.log('success', mintedResume);
    } catch (error) {
      console.log(error);

      throw new Error('No ethereum object found');
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <ResumeNFTContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        handleChange,
        mintResume,
      }}
    >
      {children}
    </ResumeNFTContext.Provider>
  );
};

export const useResumeNFT = () => useContext(ResumeNFTContext);
