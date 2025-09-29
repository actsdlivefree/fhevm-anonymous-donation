# FHEVM Anonymous Donation DApp

🚀 **Privacy-Preserving Anonymous Donation System** using Fully Homomorphic Encryption (FHEVM)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FHEVM](https://img.shields.io/badge/FHEVM-Zama-blue)](https://docs.zama.ai/fhevm)
[![Sepolia](https://img.shields.io/badge/Network-Sepolia-orange)](https://sepolia.etherscan.io/)

## 🌟 Overview

This is a complete decentralized application (DApp) that enables **anonymous donations** using Zama's Fully Homomorphic Encryption Virtual Machine (FHEVM). Donors can contribute cryptocurrency while keeping their donation amounts completely private - only visible to the project owner.

### ✨ Key Features

- 🔒 **Privacy-First**: Donation amounts are encrypted and remain private
- 👤 **Anonymous Donations**: No personal information required
- 📊 **Encrypted Statistics**: Project owners can view aggregated donation data
- 🛡️ **Zero-Knowledge Proofs**: Verify donations without revealing amounts
- 🌐 **Sepolia Deployment**: Live on Ethereum Sepolia testnet
- 📱 **Modern UI**: Beautiful, responsive React interface
- 🏗️ **Static Export**: Easy deployment to any web server

## 🏗️ Architecture

```
├── frontend/              # React Next.js application
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── fhevm/            # FHEVM integration
│   └── out/              # Static export (ready for deployment)
├── fhevm-hardhat-template/  # Hardhat smart contract project
│   ├── contracts/        # Solidity smart contracts
│   ├── test/             # Contract tests
│   └── deploy/           # Deployment scripts
└── docs/                 # Documentation
```

## 🚀 Live Demo

- **Frontend**: [Static Deployment Ready](./frontend/out/)
- **Smart Contract**: [Sepolia Testnet](https://sepolia.etherscan.io/address/0x0A4B4EDA4178235270c5F7D488CBc6DA2B318849)

## 🔧 Technology Stack

### Frontend
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Web3**: MetaMask integration
- **FHEVM**: Zama FHEVM SDK

### Smart Contracts
- **Language**: Solidity ^0.8.24
- **FHEVM**: Zama FHEVM library
- **Network**: Ethereum Sepolia testnet
- **Deployment**: Hardhat

## 📋 Prerequisites

- Node.js 18+
- MetaMask browser extension
- Sepolia ETH for gas fees

## 🛠️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/actsdlivefree/fhevm-anonymous-donation.git
cd fhevm-anonymous-donation
```

### 2. Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Smart Contracts
cd ../fhevm-hardhat-template
npm install
```

### 3. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Add your Infura API key and private key
INFURA_API_KEY=your_infura_key
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

### 4. Deploy Smart Contracts
```bash
cd fhevm-hardhat-template
npx hardhat deploy --network sepolia
```

### 5. Generate Frontend ABIs
```bash
cd ../frontend
npm run genabi
```

### 6. Start Development Server
```bash
npm run dev
```

## 🎯 Usage

### For Donors
1. Connect MetaMask wallet
2. Enter donation amount (USDC)
3. Click "Make Anonymous Donation"
4. Confirm transaction in MetaMask

### For Project Owners
1. Connect with project owner wallet
2. View encrypted statistics (decrypted for owner)
3. Generate zero-knowledge proofs
4. Batch verify donations

## 🔐 Privacy & Security

### How FHEVM Privacy Works
1. **Encryption**: Donation amounts are encrypted on the client
2. **Zero-Knowledge**: Only mathematical proofs are submitted
3. **Homomorphic Operations**: Smart contracts can operate on encrypted data
4. **Selective Decryption**: Only project owners can view aggregated statistics

### Security Features
- ✅ End-to-end encryption
- ✅ No personal data storage
- ✅ Cryptographic proof verification
- ✅ Secure key management

## 📊 API Reference

### Smart Contract Functions

#### Core Functions
- `donateAnonymous(externalEuint32, bytes)` - Make anonymous donation
- `getTotalDonations()` - Get encrypted total (owner only)
- `getDonationCount()` - Get encrypted count
- `generateDonationProof(uint256, externalEuint32, bytes)` - Generate ZK proof

#### Utility Functions
- `getUserDonationCount(address)` - Get user's donation history length
- `batchVerifyDonations(address[], externalEuint32[], bytes[])` - Batch verification

## 🧪 Testing

### Smart Contract Tests
```bash
cd fhevm-hardhat-template
npx hardhat test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Static Website Deployment
The frontend is pre-built for static hosting:

```bash
cd frontend
npm run build
# Static files are in ./out/
```

Deploy `./frontend/out/` to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Traditional web servers

### Smart Contract Deployment
```bash
cd fhevm-hardhat-template
npx hardhat deploy --network sepolia
```

## 📖 Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama Developer Portal](https://docs.zama.ai/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Zama](https://zama.ai/) for FHEVM technology
- [Ethereum](https://ethereum.org/) for the blockchain infrastructure
- [MetaMask](https://metamask.io/) for wallet integration

## 📞 Support

For questions and support:
- Create an [issue](https://github.com/actsdlivefree/fhevm-anonymous-donation/issues)
- Check the [documentation](./docs/)

---

**Built with ❤️ using FHEVM for privacy-preserving blockchain applications**
