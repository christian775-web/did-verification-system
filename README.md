\# DID Credential Verification System



\## Overview



The DID Credential Verification System is a blockchain-based identity management application that enables organizations to issue, verify, and revoke digital credentials securely. The system uses Ethereum smart contracts deployed on a local Hardhat blockchain and provides a modern web interface built with React.



The project demonstrates how Decentralized Identifiers (DIDs) and blockchain technology can be used to create tamper-resistant digital credentials.



\---



\## Features



\* MetaMask Wallet Authentication

\* Issue Digital Credentials

\* Verify Credentials

\* Revoke Credentials

\* Credential History

\* Active / Revoked Status Tracking

\* Dashboard Statistics

\* Search Credentials

\* QR Code Generation

\* Download QR Code

\* Export History to CSV

\* Ethereum Smart Contract Integration



\---



\## Technologies Used



\### Frontend



\* React.js

\* Axios

\* Ethers.js

\* QRCode.react

\* CSS



\### Backend



\* Node.js

\* Express.js



\### Blockchain



\* Solidity

\* Hardhat

\* Ethereum

\* MetaMask



\---



\## System Architecture



User → React Frontend → Express Backend → Smart Contract → Ethereum Blockchain



\---



\## Project Structure



did-verification-system/



├── backend/



├── frontend/



├── contracts/



├── scripts/



├── ignition/



├── test/



└── README.md



\---



\## Installation



\### Install Backend



npm install



\### Install Frontend



cd frontend



npm install



\---



\## Start Hardhat



npx hardhat node



\---



\## Deploy Contract



npx hardhat ignition deploy ignition/modules/CredentialRegistry.js --network localhost



\---



\## Start Backend



npm run dev



\---



\## Start Frontend



cd frontend



npm start



\---



\## Author
Okoye Christian Chisom



Final Year Project



Blockchain-Based DID Credential Verification System



