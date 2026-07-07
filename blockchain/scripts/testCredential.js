const { ethers } = require("hardhat");

async function main() {
    const contractAddress =
        "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const CredentialRegistry =
        await ethers.getContractFactory("CredentialRegistry");

    const contract =
        CredentialRegistry.attach(contractAddress);

    const credentialId = "CRD001";
    const credentialHash = "abc123hash";

    console.log("Issuing credential...");

    const tx = await contract.issueCredential(
        credentialId,
        credentialHash
    );

    await tx.wait();

    console.log("Credential issued.");

    const result =
        await contract.verifyCredential(
            credentialId,
            credentialHash
        );

    console.log("Verification:", result);
}

main().catch(console.error);