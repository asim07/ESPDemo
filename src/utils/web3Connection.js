var Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const ABI = require("../constants/holder.json");



var rpcurl = "https://polygon-mumbai.infura.io/v3/3f7108824f2446b19b1d4d3f51a89671";
var senderaddress = "0xF32F7C03a4D530935F5332CA5DC4a971149dda2E";
var receiveraddress = "0x043Fe51F898e3bf716963A2218b619DB1ea845D2";
var contractAddress = "0xaf2bafAed7186B16Aa41184FDa392A246A6fBD85";

var senderprivatekey = 'd03584ecb7364b6db0c1a904f5f5ed46afc6113f4f038179121e8b7a905d5b67';


async function sendNFTRewards (winner,looser) {

    console.log("in function");
    var provider = new Provider(senderprivatekey, rpcurl);
  var web3 = new Web3(provider);
  const address = await web3.eth.getAccounts();

    var contract = new web3.eth.Contract(ABI, contractAddress);
  console.log("transaction initiated");
  var transaction = await contract.methods.rewardDistributionNFt(winner, looser).send({ from: address[0] });
  console.log(transaction);
  return transaction;
}

async function DrawNFT (winner,looser) {

  console.log("in function");
  var provider = new Provider(senderprivatekey, rpcurl);
var web3 = new Web3(provider);
const address = await web3.eth.getAccounts();

  var contract = new web3.eth.Contract(ABI, contractAddress);
console.log("transaction initiated");
var transaction = await contract.methods.drawNFT(winner, looser).send({ from: address[0] });
console.log(transaction);
return transaction;
}


async function DrawTokens (winner,looser) {

  console.log("in function");
  var provider = new Provider(senderprivatekey, rpcurl);
var web3 = new Web3(provider);
const address = await web3.eth.getAccounts();

  var contract = new web3.eth.Contract(ABI, contractAddress);
console.log("transaction initiated");
var transaction = await contract.methods.drawTokens(winner, looser).send({ from: address[0] });
console.log(transaction);
return transaction;
}

async function sendTokenRewards (winner,looser) {

  console.log("in function");
  var provider = new Provider(senderprivatekey, rpcurl);
var web3 = new Web3(provider);
const address = await web3.eth.getAccounts();

  var contract = new web3.eth.Contract(ABI, contractAddress);
console.log("transaction initiated");
var transaction = await contract.methods.rewardDistributionToken(winner, looser).send({ from: address[0] });
console.log(transaction);
return transaction;
}

// transaction may take a few min to execute since we are using ropsten so be patient

module.exports.sendNFTRewards = sendNFTRewards;
module.exports.sendTokenRewards = sendTokenRewards;
module.exports.DrawNFT = DrawNFT;
module.exports.DrawTokens = DrawTokens;
