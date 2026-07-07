const hre = require("hardhat");

async function main() {
  const CredentialRegistry = await hre.ethers.getContractFactory("CredentialRegistry");

  const contract = await CredentialRegistry.deploy();

  await contract.waitForDeployment();

  console.log("CredentialRegistry deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});