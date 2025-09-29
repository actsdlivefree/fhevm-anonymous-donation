"use client";

import { ethers } from "ethers";
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { FhevmInstance } from "@/fhevm/fhevmTypes";
import { FhevmDecryptionSignature } from "@/fhevm/FhevmDecryptionSignature";
import { GenericStringStorage } from "@/fhevm/GenericStringStorage";

// Import the generated contract info
import { FHECounterAddresses } from "@/abi/FHECounterAddresses";
import { FHECounterABI } from "@/abi/FHECounterABI";

export type ClearValueType = {
  handle: string;
  clear: string | bigint | boolean;
};

type FHEAnonymousDonationInfoType = {
  abi: typeof FHECounterABI.abi;
  address?: `0x${string}`;
  chainId?: number;
  chainName?: string;
};

/**
 * Resolves FHEAnonymousDonation contract metadata for the given EVM `chainId`.
 */
function getFHEAnonymousDonationByChainId(
  chainId: number | undefined
): FHEAnonymousDonationInfoType {
  if (!chainId) {
    return { abi: FHECounterABI.abi };
  }

  const entry =
    FHECounterAddresses[chainId.toString() as keyof typeof FHECounterAddresses];

  if (!entry || !("address" in entry) || entry.address === ethers.ZeroAddress) {
    return { abi: FHECounterABI.abi, chainId };
  }

  return {
    address: entry.address as `0x${string}`,
    chainId: entry.chainId ?? chainId,
    chainName: entry.chainName,
    abi: FHECounterABI.abi,
  };
}

/**
 * Main FHE Anonymous Donation React hook
 */
export const useFHEAnonymousDonation = (parameters: {
  instance: FhevmInstance | undefined;
  fhevmDecryptionSignatureStorage: GenericStringStorage;
  eip1193Provider: ethers.Eip1193Provider | undefined;
  chainId: number | undefined;
  ethersSigner: ethers.JsonRpcSigner | undefined;
  ethersReadonlyProvider: ethers.ContractRunner | undefined;
  sameChain: RefObject<(chainId: number | undefined) => boolean>;
  sameSigner: RefObject<
    (ethersSigner: ethers.JsonRpcSigner | undefined) => boolean
  >;
}) => {
  const {
    instance,
    fhevmDecryptionSignatureStorage,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  } = parameters;

  //////////////////////////////////////////////////////////////////////////////
  // States + Refs
  //////////////////////////////////////////////////////////////////////////////

  // Contract states
  const [contractAddress, setContractAddress] = useState<string>("");
  const [projectOwner, setProjectOwner] = useState<string>("");
  const [totalDonations, setTotalDonations] = useState<string>("0");
  const [donationCount, setDonationCount] = useState<string>("0");
  const [myDonationCount, setMyDonationCount] = useState<number>(0);

  // UI states
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [targetAmount, setTargetAmount] = useState<string>("");
  const [proofThreshold, setProofThreshold] = useState<string>("");
  const [proofResult, setProofResult] = useState<string>("");
  const [batchResults, setBatchResults] = useState<boolean[]>([]);

  // Operation states
  const [isDonating, setIsDonating] = useState<boolean>(false);
  const [isGeneratingProof, setIsGeneratingProof] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // Refs for operation guards
  const fheContractRef = useRef<FHEAnonymousDonationInfoType | undefined>(undefined);
  const isDonatingRef = useRef<boolean>(isDonating);
  const isGeneratingProofRef = useRef<boolean>(isGeneratingProof);
  const isVerifyingRef = useRef<boolean>(isVerifying);

  //////////////////////////////////////////////////////////////////////////////
  // Contract Info
  //////////////////////////////////////////////////////////////////////////////

  const fheContract = useMemo(() => {
    const c = getFHEAnonymousDonationByChainId(chainId);
    fheContractRef.current = c;
    setContractAddress(c.address || "");
    return c;
  }, [chainId]);

  const isDeployed = useMemo(() => {
    if (!fheContract) return undefined;
    return Boolean(fheContract.address && fheContract.address !== ethers.ZeroAddress);
  }, [fheContract]);

  const isProjectOwner = useMemo(() => {
    return ethersSigner?.address === projectOwner;
  }, [ethersSigner?.address, projectOwner]);

  //////////////////////////////////////////////////////////////////////////////
  // Capabilities
  //////////////////////////////////////////////////////////////////////////////

  const canDonate = useMemo(() => {
    return (
      fheContract.address &&
      instance &&
      ethersSigner &&
      donationAmount &&
      parseFloat(donationAmount) > 0 &&
      !isDonating
    );
  }, [fheContract.address, instance, ethersSigner, donationAmount, isDonating]);

  const canGenerateProof = useMemo(() => {
    return (
      fheContract.address &&
      instance &&
      ethersSigner &&
      proofThreshold &&
      parseFloat(proofThreshold) > 0 &&
      myDonationCount > 0 &&
      !isGeneratingProof
    );
  }, [fheContract.address, instance, ethersSigner, proofThreshold, myDonationCount, isGeneratingProof]);

  //////////////////////////////////////////////////////////////////////////////
  // Anonymous Donation
  //////////////////////////////////////////////////////////////////////////////

  const makeDonation = useCallback(() => {
    if (isDonatingRef.current) return;

    if (!fheContract.address || !instance || !ethersSigner || !donationAmount) {
      setMessage("Missing required parameters for donation");
      return;
    }

    const amount = parseFloat(donationAmount);
    if (amount <= 0) {
      setMessage("Donation amount must be greater than 0");
      return;
    }

    const thisChainId = chainId;
    const thisContractAddress = fheContract.address;
    const thisSigner = ethersSigner;
    const thisAmount = amount;

    isDonatingRef.current = true;
    setIsDonating(true);
    setMessage(`🔄 Starting anonymous donation of ${amount} USDC...`);

    const run = async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Let UI update

      const isStale = () =>
        thisContractAddress !== fheContractRef.current?.address ||
        !sameChain.current(thisChainId) ||
        !sameSigner.current(thisSigner);

      try {
        // Create encrypted input for amount only
        console.log("Creating encrypted input with instance:", instance);
        const amountInput = instance.createEncryptedInput(
          thisContractAddress,
          thisSigner.address
        );
        console.log("Input created:", amountInput);
        amountInput.add32(Math.floor(thisAmount)); // Convert to integer
        console.log("Value added to input");

        // Encrypt the amount input
        console.log("Starting encryption...");
        const amountEnc = await amountInput.encrypt();
        console.log("Encryption completed:", amountEnc);

        if (isStale()) {
          setMessage("❌ Donation cancelled - context changed");
          return;
        }

        setMessage("🔐 Calling donation contract...");

        // Create contract instance
        const contract = new ethers.Contract(
          thisContractAddress,
          fheContract.abi,
          thisSigner
        );

        // Debug: Log the encrypted input details
        console.log("Encrypted input handles:", amountEnc.handles);
        console.log("Input proof length:", amountEnc.inputProof.length);
        console.log("Contract address:", thisContractAddress);
        console.log("Signer address:", thisSigner.address);

        // Make the donation call with correct parameters
        let tx;
        try {
          // First try to estimate gas to get better error messages
          const gasEstimate = await contract.donateAnonymous.estimateGas(
            amountEnc.handles[0],
            amountEnc.inputProof
          );
          console.log("Gas estimate successful:", gasEstimate);

          tx = await contract.donateAnonymous(
            amountEnc.handles[0],
            amountEnc.inputProof
          );
        } catch (estimateError) {
          console.error("Gas estimation failed:", estimateError);
          throw new Error(`Gas estimation failed: ${estimateError instanceof Error ? estimateError.message : 'Unknown gas estimation error'}`);
        }

        setMessage(`⏳ Waiting for transaction ${tx.hash}...`);

        const receipt = await tx.wait();
        setMessage(`✅ Donation completed! Status: ${receipt?.status === 1 ? 'Success' : 'Failed'}`);

        if (isStale()) {
          setMessage("❌ Donation completed but context changed");
          return;
        }

        // Refresh statistics
        refreshStatistics();

      } catch (error) {
        console.error("Donation error:", error);
        setMessage(`❌ Donation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        isDonatingRef.current = false;
        setIsDonating(false);
      }
    };

    run();
  }, [
    ethersSigner,
    fheContract.address,
    fheContract.abi,
    instance,
    donationAmount,
    chainId,
    sameChain,
    sameSigner,
  ]);

  //////////////////////////////////////////////////////////////////////////////
  // Statistics and Owner Functions
  //////////////////////////////////////////////////////////////////////////////

  const refreshStatistics = useCallback(() => {
    if (isVerifyingRef.current) return;

    if (!fheContract.address || !ethersReadonlyProvider) {
      return;
    }

    isVerifyingRef.current = true;
    setIsVerifying(true);
    setMessage("📊 Refreshing statistics...");

    const thisContractAddress = fheContract.address;
    const thisContract = new ethers.Contract(
      thisContractAddress,
      fheContract.abi,
      ethersReadonlyProvider
    );

    const run = async () => {
      try {
        // Get project owner
        const owner = await thisContract.projectOwner();
        setProjectOwner(owner);

        if (thisContractAddress !== fheContractRef.current?.address) return;

        // Get statistics - decrypt encrypted values for authorized users
        let total: string = "0";
        let count: string = "0";

        try {
            // Check if current user is project owner
            const currentUserIsOwner = owner.toLowerCase() === ethersSigner?.address?.toLowerCase();

            if (currentUserIsOwner) {
                // Project owner can see decrypted values
                try {
                    const encryptedTotal = await thisContract.getTotalDonations();
                    const encryptedCount = await thisContract.getDonationCount();

                    // Decrypt using FHEVM instance
                    if (instance) {
                        try {
                            // Use publicDecrypt for statistics that should be visible to project owner
                            const decryptedResults = await instance.publicDecrypt([encryptedTotal, encryptedCount]);
                            total = decryptedResults[encryptedTotal]?.toString() || "0";
                            count = decryptedResults[encryptedCount]?.toString() || "0";
                        } catch (decryptError) {
                            console.warn("Failed to decrypt statistics:", decryptError);
                            total = "⚠️ Decryption failed";
                            count = "⚠️ Decryption failed";
                        }
                    } else {
                        total = "🔄 FHEVM not ready";
                        count = "🔄 FHEVM not ready";
                    }
                } catch (error) {
                    console.warn("Failed to get encrypted statistics:", error);
                    total = "⚠️ Failed to access statistics";
                    count = "⚠️ Failed to access statistics";
                }
            } else {
                // Regular users see encrypted placeholders
                total = "🔒 Encrypted (visible to project owner only)";
                count = "🔒 Encrypted (visible to project owner only)";
            }
        } catch (error) {
            console.warn("Failed to get statistics:", error);
            total = "❌ Error loading statistics";
            count = "❌ Error loading statistics";
        }

        if (thisContractAddress !== fheContractRef.current?.address) return;

        setTotalDonations(total);
        setDonationCount(count);

        // Get current user's donation count if we have a signer
        if (ethersSigner) {
          const userCount = await thisContract.getUserDonationCount(ethersSigner.address);
          setMyDonationCount(Number(userCount));
        }

        setMessage("✅ Statistics updated");

      } catch (error) {
        console.error("Statistics error:", error);
        setMessage(`❌ Failed to refresh statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        isVerifyingRef.current = false;
        setIsVerifying(false);
      }
    };

    run();
  }, [fheContract.address, fheContract.abi, ethersReadonlyProvider, ethersSigner, instance]);

  const verifyTotalAmount = useCallback(() => {
    if (isVerifyingRef.current || !targetAmount) return;

    if (!fheContract.address || !instance || !ethersSigner) {
      setMessage("Missing required parameters for verification");
      return;
    }

    const amount = parseFloat(targetAmount);
    if (amount <= 0) {
      setMessage("Target amount must be greater than 0");
      return;
    }

    const thisContractAddress = fheContract.address;
    const thisSigner = ethersSigner;
    const thisTarget = Math.floor(amount);

    isVerifyingRef.current = true;
    setIsVerifying(true);
    setMessage(`🔍 Verifying if total donations reach ${amount} USDC...`);

    const run = async () => {
      try {
        // Create encrypted target amount
        const targetInput = instance.createEncryptedInput(
          thisContractAddress,
          thisSigner.address
        );
        targetInput.add64(thisTarget);

        const targetEnc = await targetInput.encrypt();

        // Create contract instance
        const contract = new ethers.Contract(
          thisContractAddress,
          fheContract.abi,
          thisSigner
        );

        // Verify total amount
        const result = await contract.verifyTotalAmount(
          targetEnc.handles[0],
          targetEnc.inputProof
        );

        setMessage(`✅ Verification completed: ${result ? 'Target reached!' : 'Target not reached'}`);

      } catch (error) {
        console.error("Verification error:", error);
        setMessage(`❌ Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        isVerifyingRef.current = false;
        setIsVerifying(false);
      }
    };

    run();
  }, [fheContract.address, fheContract.abi, instance, ethersSigner, targetAmount]);

  //////////////////////////////////////////////////////////////////////////////
  // Zero-Knowledge Proof Generation
  //////////////////////////////////////////////////////////////////////////////

  const generateProof = useCallback(() => {
    if (isGeneratingProofRef.current || !proofThreshold) return;

    if (!fheContract.address || !instance || !ethersSigner) {
      setMessage("Missing required parameters for proof generation");
      return;
    }

    const threshold = parseFloat(proofThreshold);
    if (threshold <= 0) {
      setMessage("Proof threshold must be greater than 0");
      return;
    }

    const thisContractAddress = fheContract.address;
    const thisSigner = ethersSigner;
    const thisThreshold = Math.floor(threshold);
    const currentDonationCount = myDonationCount; // Capture current value

    isGeneratingProofRef.current = true;
    setIsGeneratingProof(true);
    setMessage(`🛡️ Generating proof for donations ≥ ${threshold} USDC...`);

    const run = async () => {
      try {
        // Create encrypted threshold
        const thresholdInput = instance.createEncryptedInput(
          thisContractAddress,
          thisSigner.address
        );
        thresholdInput.add32(thisThreshold);

        const thresholdEnc = await thresholdInput.encrypt();

        // Create contract instance
        const contract = new ethers.Contract(
          thisContractAddress,
          fheContract.abi,
          thisSigner
        );

        // Generate proof for each of user's donations
        const proofs: boolean[] = [];
        for (let i = 0; i < currentDonationCount; i++) {
          const result = await contract.generateDonationProof(
            i,
            thresholdEnc.handles[0],
            thresholdEnc.inputProof
          );
          proofs.push(result);
        }

        const validProofs = proofs.filter(p => p).length;
        setProofResult(`✅ Generated ${validProofs}/${proofs.length} valid proofs`);

        setMessage(`🛡️ Proof generation completed: ${validProofs}/${proofs.length} donations meet threshold`);

      } catch (error) {
        console.error("Proof generation error:", error);
        setMessage(`❌ Proof generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        isGeneratingProofRef.current = false;
        setIsGeneratingProof(false);
      }
    };

    run();
  }, [fheContract.address, fheContract.abi, instance, ethersSigner, proofThreshold]); // Remove myDonationCount to prevent loops

  //////////////////////////////////////////////////////////////////////////////
  // Batch Verification
  //////////////////////////////////////////////////////////////////////////////

  const batchVerifyProofs = useCallback(() => {
    if (isVerifyingRef.current) return;

    if (!fheContract.address || !instance || !ethersSigner) {
      setMessage("Missing required parameters for batch verification");
      return;
    }

    const thisContractAddress = fheContract.address;
    const thisSigner = ethersSigner;
    const currentDonationCount = myDonationCount; // Capture current value

    isVerifyingRef.current = true;
    setIsVerifying(true);
    setMessage(`🔍 Batch verifying all donations...`);

    const run = async () => {
      try {
        // Create contract instance
        const contract = new ethers.Contract(
          thisContractAddress,
          fheContract.abi,
          thisSigner
        );

        // Batch verify all user's donations
        const donationIds = Array.from({ length: currentDonationCount }, (_, i) => i);
        const threshold = 1; // Minimum threshold for verification

        const thresholdInput = instance.createEncryptedInput(
          thisContractAddress,
          thisSigner.address
        );
        thresholdInput.add32(threshold);

        const thresholdEnc = await thresholdInput.encrypt();

        const proofs = thresholdEnc.inputProof;
        const results = await contract.batchVerifyDonations(
          donationIds,
          new Array(currentDonationCount).fill(thresholdEnc.handles[0]),
          new Array(currentDonationCount).fill(proofs)
        );

        setBatchResults(results);
        // results是一个加密数组(bytes32[])，我们无法直接在客户端解密
        // 所以我们只显示验证已完成，不显示具体结果
        setMessage(`🔍 Batch verification completed: ${currentDonationCount} donations sent for verification`);

      } catch (error) {
        console.error("Batch verification error:", error);
        setMessage(`❌ Batch verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        isVerifyingRef.current = false;
        setIsVerifying(false);
      }
    };

    run();
  }, [fheContract.address, fheContract.abi, instance, ethersSigner]); // Remove myDonationCount to prevent loops

  //////////////////////////////////////////////////////////////////////////////
  // Auto-refresh statistics when contract is available
  //////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    // Only auto-refresh when contract is first loaded, not on every state change
    if (fheContract.address && ethersReadonlyProvider && !isVerifying && ethersSigner) {
      refreshStatistics();
    }
  }, [fheContract.address, ethersReadonlyProvider, ethersSigner]); // Remove isVerifying to prevent loops

  return {
    // Contract info
    contractAddress,
    projectOwner,
    isDeployed,
    isProjectOwner,

    // Statistics
    totalDonations,
    donationCount,
    myDonationCount,

    // UI state
    donationAmount,
    targetAmount,
    proofThreshold,
    proofResult,
    batchResults,

    // Operation states
    isDonating,
    isGeneratingProof,
    isVerifying,

    // Capabilities
    canDonate,
    canGenerateProof,

    // Actions
    makeDonation,
    refreshStatistics,
    verifyTotalAmount,
    generateProof,
    batchVerifyProofs,

    // UI setters
    setDonationAmount,
    setTargetAmount,
    setProofThreshold,

    // Messages
    message,
  };
};
