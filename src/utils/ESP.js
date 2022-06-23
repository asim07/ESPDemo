const Web3 = require("web3");
const erc20 = require("../constants/erc20");
const address = require("../../output.json");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const token = new web3.eth.Contract(erc20.abi, address.Token);
const fetchBalance = async (address) => {
  const balance = await token.methods
    .balanceOf(address)
    .call();
  console.log(balance);
};

const allowance = async (allocater, spender) => {
  const amount = await token.methods.allowance(allocater, spender).call();
  console.log(amount);
};

allowance("0xa1B406188395cDB1218f89294BFFE47525e4402B","0xf23C33f05A0D9eBF7F8DE15262ED230EB3fcE85f");
