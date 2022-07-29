import { useState } from "react";

import Web3 from "web3";

import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";

import token from "./constants/erc20.json";
import holder from "./constants/holder.json";
import NFT from "./constants/NFT.json";
import address from "./utils/output.json";
import reward from "./constants/reward.json";

import { sendNFTRewards ,sendTokenRewards} from "./utils/web3Connection";
import "./App.css";

const CoinbaseWallet = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  appName: "Web3-react Demo",
  supportedChainIds: [1, 3, 4, 5, 42],
});

const WalletConnect = new WalletConnectConnector({
  rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});
function App() {
  // const [address,setAddress] = useState('');
  // const [mintingAddress,setMintingAddress] = useState('');
  const [rewardAmount, SetrewardAmount] = useState("empty");
  const [amountofNFT, setAmountofNFT] = useState(""); //number of nft to mint
  const [nftID, setNftId] = useState("");   //nftid for stake
  const [nftdata, setNftdata] = useState([]);
  const [tokenbalance, setTokenBalance] = useState(""); //show token balance
  const [stakedNFT, setStakedNFT] = useState(""); //show staked nft id
  const [stakedtoken, setStakedToken] = useState(""); //show staked token
  const [tokenAmountToStake, setTokenAmountoStake] = useState(""); //set amount of tokens to staked
  
  //address for user to win or loose
  const [winneraddress, setwinnerAddress] = useState(""); //
  const [looseraddress, setlooserAddress] = useState(""); //

  //allow user to stake nft with required id
  const stakeNFt = async () => {
    const provider = await Injected.activate();
    const web3 = new Web3(provider.provider);
    const NFTobj = new web3.eth.Contract(NFT.abi, address.NFT);
    const holderobj = new web3.eth.Contract(holder, address.holder);
    const account = await web3.eth.getAccounts();
    console.log("working",account);
    const tx1 = {
      from: account[0],
      to: address.NFT,
    };
    let approval = await NFTobj.methods
      .setApprovalForAll(address.holder, true)
      .send(tx1);
    let tx2 = {
      from: account[0],
      to: address.holder,
    };

    console.log(approval);
    let stake = await holderobj.methods.StakeNFt(nftID).send(tx2);
    console.log(stake);
  };

  const MintNFT = async (_amount) => {
    const provider = await Injected.activate();
    const web3 = new Web3(provider.provider);
    const NFTobj = new web3.eth.Contract(NFT.abi, address.NFT);
    const account = await web3.eth.getAccounts();
    console.log(account);
    let amount = await NFTobj.methods.cost.call().call();
    console.log(amount);

    let tx = {
      from: account[0],
      to: address.NFT,
      value: amount,
    };

    let mintres = await NFTobj.methods.mint(parseInt(amountofNFT)).send(tx);
    console.log(mintres);
  };

  //it fetch the amount of nft and hold by the wallet with metadata to show on frontend
  const walletNFT = async () => {
    const provider = await Injected.activate();
    const web3 = new Web3(provider.provider);
    const NFTobj = new web3.eth.Contract(NFT.abi, address.NFT);
    const holderobj = new web3.eth.Contract(holder.abi, address.holder);
    const account = await web3.eth.getAccounts();
    const values = await NFTobj.methods.walletOfOwner(account[0]).call();
    console.log(values);
    const NFTData = [];
    const data = await values.map(async (id) => {
      NFTData.push(await NFTobj.methods.tokenURI(id).call());
    });

    setNftdata(NFTData);
    console.log(NFTData);
  };

  //it shows the rewards of addresses

  const rewards = async () => {
    const provider = await Injected.activate();
    const web3 = new Web3(provider.provider);
    const rewards = new web3.eth.Contract(reward, address.distributer);
    const account = await web3.eth.getAccounts();
    const amount = await rewards.methods.showrewards(account[0]).call();
    console.log(amount);
    SetrewardAmount(amount);
  };

  //allow user to claim the rewards
  const claimRewards = async () => {
    const provider = await Injected.activate();
    const web3 = new Web3(provider.provider);
    const rewards = new web3.eth.Contract(reward, address.distributer);
    const account = await web3.eth.getAccounts();
    const tx = {
      from : account[0],
    }
    const amount = await rewards.methods.claimReward().send(tx);
    console.log(amount);
    SetrewardAmount(rewards);
  };


  //distribute the rewards NFT

  const rewardDistributorNFT = async () => { 
    const results = await sendNFTRewards(winneraddress,looseraddress);
    console.log(results);
  }


  //distribute the rewards Token ESP
  const rewardDistributorToken = async () => { 
    const results = await sendTokenRewards(winneraddress,looseraddress);
    console.log(results);
  }
  //show token balance
  const tokenBalance = async () => {
    const provider = await Injected.activate();
    const web3 = new Web3(provider.provider);
    const rewards = new web3.eth.Contract(token.abi, address.Token);
    const account = await web3.eth.getAccounts();
    const amount = await rewards.methods.balanceOf(account[0]).call();
    console.log(amount);
    setTokenBalance(amount);
  };

  //show staked NFT
  const StakedNFT = async () => { 
    const provider = await Injected.activate();
    const web3 = new Web3(provider.provider);
    const holderobj = new web3.eth.Contract(holder, address.holder);
    const account = await web3.eth.getAccounts();
    const nftID = await holderobj.methods.checkStatusNFT(account[0]).call();
    if (parseInt(nftID) != 0) {
      setStakedNFT(nftID);
    } else { 
      setStakedNFT("No nft staked");
    }
  }


  //show staked token balance

  const tokenStakedAmount = async () => { 
    const provider = await Injected.activate();
    const web3 = new Web3(provider.provider);
    const holderobj = new web3.eth.Contract(holder, address.holder);
    const account = await web3.eth.getAccounts();
    const nftID = await holderobj.methods.stakedAmount(account[0]).call();
      setStakedToken(nftID);
 
  }


  //stake tokens for game

  const stakeTokens = async () => {
    const provider = await Injected.activate();
    const web3 = new Web3(provider.provider);
    const tokenobj = new web3.eth.Contract(token.abi, address.Token);
    const holderobj = new web3.eth.Contract(holder, address.holder);
    const account = await web3.eth.getAccounts();
    console.log("working",account);
    const tx1 = {
      from: account[0],
      to: address.NFT,
    };
    let approval = await tokenobj.methods
      .approve(address.holder,Web3.utils.toWei(tokenAmountToStake))
      .send(tx1);
    let tx2 = {
      from: account[0],
      to: address.holder,
    };

    console.log(approval);
    let stake = await holderobj.methods.EnterStake(Web3.utils.toWei(tokenAmountToStake+"",'ether')).send(tx2);
    console.log(stake);
  };


  const { active, chainId, account } = useWeb3React();

  const { activate, deactivate } = useWeb3React();

  return (
    <div className="App">
      <button
        onClick={() => {
          activate(CoinbaseWallet);
        }}
      >
        Coinbase Wallet
      </button>
      <button
        onClick={() => {
          activate(WalletConnect);
        }}
      >
        Wallet Connect
      </button>
      <button
        onClick={() => {
          activate(Injected);
        }}
      >
        Metamask
      </button>
      <button onClick={deactivate}>Disconnect</button>
      <div style={{ paddingRight: "1000px" }}>
        <div style={{ align: "center" }}>
          {" "}
          <ul style={{"list-style-type": "none"}}>
            <li>
              {" "}
              <button onClick={rewards}>Show rewards</button>{" "}
              {" " + rewardAmount}
            </li>
            <li>
              {" "}
              <button onClick={claimRewards}>claim rewards</button>
            </li>
            <li>
              {" "}
              <button onClick={tokenBalance}>Show token Balance</button>
              {" " + tokenbalance }
            </li>
            <li>
              {" "}
              <button onClick={StakedNFT}>Show staked NFT ID</button>
              {" " + stakedNFT }
            </li>
            <li>
              {" "}
              <button onClick={tokenStakedAmount}>show staked tokens</button>
              {" " + stakedtoken }
            </li>
          </ul>
        </div>
      </div>
      <div>
        <input
          placeholder="amount of nft"
          type="text"
          name="metadata"
          onChange={(event) => setAmountofNFT(event.target.value)}
        />{" "}
        <button onClick={MintNFT}>Mint</button>
      </div>

      {/* <div>{`Connection Status: ${active}`}</div>
      <div>{`Account: ${account}`}</div>
      <div>{`Network ID: ${chainId}`}</div> */}
      <div>
        <div style={{ }}>
          <input
            placeholder="NFT ID"
            type="text"
            name="metadata"
            onChange={(event) => setNftId(event.target.value)}
          />
          <button onClick={stakeNFt}>Stake NFT</button>
        </div>
        <div style={{ }}>
          <input
            placeholder="Token amount example 500"
            type="text"
            name="metadata"
            onChange={(event) => setTokenAmountoStake(event.target.value)}
          />
          <button onClick={stakeTokens}>Stake tokens</button>
        </div>
        <div style={{ }}>
          <input
            placeholder="winner address"
            type="text"
            name="metadata"
            onChange={(event) => setwinnerAddress(event.target.value)}
          />
          <input
            placeholder="looser address"
            type="text"
            name="metadata"
            onChange={(event) => setlooserAddress(event.target.value)}
          />
          <button onClick={rewardDistributorNFT}>distribute NFT rewards</button>
        </div>
        <div style={{ }}>
          <input
            placeholder="winner address"
            type="text"
            name="metadata"
            onChange={(event) => setwinnerAddress(event.target.value)}
          />
          <input
            placeholder="looser address"
            type="text"
            name="metadata"
            onChange={(event) => setlooserAddress(event.target.value)}
          />
          <button onClick={rewardDistributorToken}>distribute Token rewards</button>
        </div>
      </div>
    </div>
  );
}

export default App;
