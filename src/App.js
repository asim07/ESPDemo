import { useState } from "react";

import Web3 from "web3";

import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";

import erc20 from "./constants/erc20.json";
import holder from "./constants/holder.json";
import NFT from "./constants/NFT.json";
import address from "./utils/output.json";
import reward from "./constants/reward.json";

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
  const [amountofNFT, setAmountofNFT] = useState("");
  const [nftdata, setNftdata] = useState([]);

  //allow user to stake nft with required id
  const stakeNFt = async () => {
    const provider = await Injected.activate();
    const web3 = new Web3(provider.provider);
    const NFTobj = new web3.eth.Contract(NFT.abi, address.NFT);
    const holderobj = new web3.eth.Contract(holder.abi, address.holder);
    const account = await web3.eth.getAccounts();
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
    let stake = await holderobj.methods.StakeNFt(10).send(tx2);
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

  // const deploySequential = async ()=>{

  //   const provider = await  Injected.activate();
  //   const web3 = new Web3(provider.provider);
  //   const contract = new web3.eth.Contract(contractData.abi,contractData.contractAddress)
  //   const address = await web3.eth.getAccounts();

  //   const tx = {
  //     to : contractData.contractAddress,
  //     from : address[0],
  //   }
  //   let gasfee = await contract.methods.deploySequential(CollectionName,symbol,MetadataURI,MintingCounter,MintingPrice).estimateGas(tx);
  // console.log(gasfee);
  //   tx.gas = web3.utils.toHex(gasfee)

  //   const transaction = await  contract.methods.deploySequential(CollectionName,symbol,MetadataURI,MintingCounter,MintingPrice).send(tx);
  //   const newContractAddress = transaction.events[0].address;
  //   if(typeof newContractAddress !== undefined){
  //     setAddress(newContractAddress);
  //   }else {
  //     setAddress("transaction failed");

  //   }  }

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
            onChange={(event) => setAmountofNFT(event.target.value)}
          />
          <button onClick={stakeNFt}>Stake NFT</button>
        </div>
      </div>
    </div>
  );
}

export default App;
