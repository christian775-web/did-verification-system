const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);

const abi = require("./abi.json");

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  wallet
);

async function testConnection() {
  try {
    const network = await provider.getNetwork();

    console.log("=================================");
    console.log("Blockchain Connected");
    console.log("Chain ID:", network.chainId.toString());
    console.log("Contract:", process.env.CONTRACT_ADDRESS);
    console.log("=================================");
  } catch (err) {
    console.log(err);
  }
}

testConnection();

module.exports = contract;