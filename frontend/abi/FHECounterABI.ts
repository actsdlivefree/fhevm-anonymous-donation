
/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const FHECounterABI = {
  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "donor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "donationHash",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "encryptedAmount",
          "type": "bytes32"
        }
      ],
      "name": "DonationMade",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint32",
          "name": "donationId",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "encryptedAmount",
          "type": "bytes32"
        }
      ],
      "name": "DonationReceived",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "encryptedTotal",
          "type": "bytes32"
        }
      ],
      "name": "TotalDonationsUpdated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "donationIndices",
          "type": "uint256[]"
        },
        {
          "internalType": "externalEuint32[]",
          "name": "thresholds",
          "type": "bytes32[]"
        },
        {
          "internalType": "bytes[]",
          "name": "thresholdProofs",
          "type": "bytes[]"
        }
      ],
      "name": "batchVerifyDonations",
      "outputs": [
        {
          "internalType": "ebool[]",
          "name": "",
          "type": "bytes32[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint32",
          "name": "encryptedAmount",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "amountProof",
          "type": "bytes"
        }
      ],
      "name": "donateAnonymous",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "donationIndex",
          "type": "uint256"
        },
        {
          "internalType": "externalEuint32",
          "name": "threshold",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "thresholdProof",
          "type": "bytes"
        }
      ],
      "name": "generateDonationProof",
      "outputs": [
        {
          "internalType": "ebool",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getDonationCount",
      "outputs": [
        {
          "internalType": "euint32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getStatistics",
      "outputs": [
        {
          "internalType": "euint64",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "euint32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalDonations",
      "outputs": [
        {
          "internalType": "euint64",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "donor",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getUserDonationAmount",
      "outputs": [
        {
          "internalType": "euint64",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "donor",
          "type": "address"
        }
      ],
      "name": "getUserDonationCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "donor",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getUserDonationHash",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "donor",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getUserDonationTimestamp",
      "outputs": [
        {
          "internalType": "euint32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "projectOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "resetState",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint32",
          "name": "encryptedAmount",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "amountProof",
          "type": "bytes"
        }
      ],
      "name": "testACLPermissions",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint32",
          "name": "encryptedAmount",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "amountProof",
          "type": "bytes"
        }
      ],
      "name": "testArrayOperations",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "testCounterUpdate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint32",
          "name": "encryptedAmount",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "amountProof",
          "type": "bytes"
        }
      ],
      "name": "testFHEAdd",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint32",
          "name": "encryptedValue",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "proof",
          "type": "bytes"
        }
      ],
      "name": "testFHEInput",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "testSimpleStateOps",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint32",
          "name": "encryptedAmount",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "amountProof",
          "type": "bytes"
        }
      ],
      "name": "testStateUpdates",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "testTimestampCreation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint32",
          "name": "encryptedAmount",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "amountProof",
          "type": "bytes"
        }
      ],
      "name": "testTypeConversion",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint64",
          "name": "targetAmount",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "targetProof",
          "type": "bytes"
        }
      ],
      "name": "verifyTotalAmount",
      "outputs": [
        {
          "internalType": "ebool",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
} as const;

