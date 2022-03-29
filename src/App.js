import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
const contractAddress = '0x6937A928e974465A7f234772A647e9bebcE635aA';
const contractABI = [
  'function getRandom() public view returns (uint)',
  'function playersCount() public view returns (uint)',
  'function players(uint) public view returns (address)',
  'function owner() public view returns (address)',
  'function winnersCount() public view returns (uint)',
];
// The Contract object
const contract = new ethers.Contract(contractAddress, contractABI, provider);

function App() {
  const [currentPlayers, setCurrentPlayers] = useState([]);

  useEffect(() => {
    async function fetchContractInfo() {
      // Get tolat number of players
      const playersCount = parseInt(ethers.utils.formatUnits(await contract.playersCount(), 0));
      const playerGetters = [];
      for (let i = 0; i < playersCount; i++) {
        playerGetters.push(contract.players(i));
      }

      // Fetch all player's addresses
      const playersAddresses = await Promise.all(playerGetters);
      setCurrentPlayers(playersAddresses);

      // 2. Get the number of winners
      // Iterate over all winners, and get their addresses
    }
    fetchContractInfo();
  }, []);

  return (
    <div className="App">
      <main className="App-main">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://rinkeby.etherscan.io/address/0x6937A928e974465A7f234772A647e9bebcE635aA"
          rel="noopener noreferrer"
        >
          Lottery
        </a>
        Current Players:
        <ul>
          {currentPlayers.map((address, index) => {
            return <li key={index}>{address}</li>;
          })}
        </ul>
      </main>
    </div>
  );
}

export default App;
