"use client";

import { useFhevm } from "../fhevm/useFhevm";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { useFHEAnonymousDonation } from "@/hooks/useFHEAnonymousDonation";
import { errorNotDeployed } from "./ErrorNotDeployed";

/*
 * Main FHE Anonymous Donation React component
 * Features:
 *  - Anonymous donation with encrypted amount and identity
 *  - Project owner can view total donations
 *  - Generate zero-knowledge proofs for donation amounts
 *  - Batch verification of donation proofs
 */
export const FHEAnonymousDonationDemo = () => {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    isConnected,
    connect,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains,
  } = useMetaMaskEthersSigner();

  //////////////////////////////////////////////////////////////////////////////
  // FHEVM instance
  //////////////////////////////////////////////////////////////////////////////

  const { instance: fhevmInstance } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  //////////////////////////////////////////////////////////////////////////////
  // useFHEAnonymousDonation is a custom hook containing all the donation logic
  //////////////////////////////////////////////////////////////////////////////

  const donation = useFHEAnonymousDonation({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  //////////////////////////////////////////////////////////////////////////////
  // UI Components
  //////////////////////////////////////////////////////////////////////////////

  const buttonClass =
    "inline-flex items-center justify-center rounded-xl bg-black px-4 py-4 font-semibold text-white shadow-sm " +
    "transition-colors duration-200 hover:bg-blue-700 active:bg-blue-800 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const titleClass = "text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2";

  if (!isConnected) {
    return (
      <div className="mx-auto">
        <button
          className={buttonClass}
          disabled={isConnected}
          onClick={connect}
        >
          <span className="text-4xl p-6">Connect to MetaMask</span>
        </button>
      </div>
    );
  }

  if (donation.isDeployed === false) {
    return errorNotDeployed(chainId);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-100 mb-6">
            <span className="text-2xl">🔒</span>
            <span className="font-semibold text-gray-900">FHE Anonymous Donation</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Privacy-First Giving
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience truly private donations powered by Fully Homomorphic Encryption and zero-knowledge proofs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Statistics & Info */}
          <div className="space-y-6">

            {/* Donation Statistics */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <p className={titleClass}>
                <span className="text-2xl">📊</span>
                <span>Donation Statistics</span>
              </p>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <p className="text-sm font-medium text-blue-700 mb-2">Total Donations</p>
                  <p className="text-3xl font-bold text-blue-900">{donation.totalDonations}</p>
                  <p className="text-xs text-blue-600 mt-1">USDC</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <p className="text-sm font-medium text-green-700 mb-2">Donation Count</p>
                  <p className="text-3xl font-bold text-green-900">{donation.donationCount}</p>
                  <p className="text-xs text-green-600 mt-1">Total transactions</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <p className="text-sm font-medium text-purple-700 mb-2">Your Donations</p>
                  <p className="text-3xl font-bold text-purple-900">{donation.myDonationCount}</p>
                  <p className="text-xs text-purple-600 mt-1">Your contributions</p>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <p className={titleClass}>
                <span className="text-2xl">🔗</span>
                <span>System Status</span>
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">FHEVM Instance</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    fhevmInstance ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {fhevmInstance ? '✅ Ready' : '❌ Not Ready'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Chain ID</span>
                  <span className="font-mono text-sm text-gray-900">{chainId || 'N/A'}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-2">Contract Address</p>
                  <p className="font-mono text-xs text-gray-900 break-all">{donation.contractAddress || 'Not available'}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Center Column - Main Donation Interface */}
          <div className="lg:col-span-2 space-y-6">

            {/* Donation Interface */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <p className={titleClass}>
                <span className="text-2xl">💝</span>
                <span>Make Anonymous Donation</span>
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Donation Amount (USDC)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={donation.donationAmount}
                      onChange={(e) => donation.setDonationAmount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                      placeholder="Enter donation amount"
                      min="1"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                      USDC
                    </div>
                  </div>
                </div>

                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={!donation.canDonate}
                  onClick={donation.makeDonation}
                >
                  {donation.canDonate ? (
                    <>
                      <span className="text-2xl">💝</span>
                      <span>Make Anonymous Donation</span>
                      <span className="text-lg">🔒</span>
                    </>
                  ) : donation.isDonating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing Donation...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">⚠️</span>
                      <span>Cannot donate now</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Status Messages */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <p className={titleClass}>
                <span className="text-2xl">💬</span>
                <span>Status</span>
              </p>
              <div className="bg-gray-50 rounded-xl p-4 min-h-[60px] flex items-center">
                <p className={`text-sm ${donation.message.includes('✅') ? 'text-green-600' : donation.message.includes('❌') ? 'text-red-600' : 'text-gray-600'}`}>
                  {donation.message || "Ready to donate..."}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Project Owner Controls */}
        {donation.isProjectOwner && (
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 shadow-xl border border-amber-200">
            <p className={titleClass}>
              <span className="text-2xl">👑</span>
              <span>Project Owner Controls</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              {/* Statistics Management */}
              <div className="space-y-4">
                <button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
                  onClick={donation.refreshStatistics}
                  disabled={donation.isVerifying}
                >
                  {donation.isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Refreshing...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">📊</span>
                      <span>Refresh Statistics</span>
                    </>
                  )}
                </button>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Target Amount for Verification (USDC)
                  </label>
                  <input
                    type="number"
                    value={donation.targetAmount}
                    onChange={(e) => donation.setTargetAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter target amount"
                  />
                </div>

                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
                  onClick={donation.verifyTotalAmount}
                  disabled={donation.isVerifying || !donation.targetAmount}
                >
                  {donation.isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🔍</span>
                      <span>Verify Total Amount</span>
                    </>
                  )}
                </button>
              </div>

              {/* Proof Management */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Proof Threshold (USDC)
                  </label>
                  <input
                    type="number"
                    value={donation.proofThreshold}
                    onChange={(e) => donation.setProofThreshold(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter threshold amount"
                  />
                </div>

                <button
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
                  onClick={donation.generateProof}
                  disabled={!donation.canGenerateProof}
                >
                  {donation.canGenerateProof ? (
                    <>
                      <span className="text-xl">🛡️</span>
                      <span>Generate Proof</span>
                    </>
                  ) : donation.isGeneratingProof ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">⚠️</span>
                      <span>Cannot generate</span>
                    </>
                  )}
                </button>

                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Proof Result</p>
                  <p className="text-sm text-gray-600">{donation.proofResult || "No proof generated yet"}</p>
                </div>

                <button
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
                  onClick={donation.batchVerifyProofs}
                  disabled={donation.isVerifying}
                >
                  {donation.isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🔍</span>
                      <span>Batch Verify Proofs</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        </div>
      </div>
    );
};

