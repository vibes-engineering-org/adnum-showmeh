"use client";

import { useState, useEffect } from "react";
import { useMiniAppSdk } from "~/hooks/use-miniapp-sdk";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar } from "~/components/ui/avatar";
import { ShareCastButton } from "~/components/share-cast-button";
import { UserContext } from "~/components/user-context";
import { DaimoPayTransferButton } from "~/components/daimo-pay-transfer-button";

const JACKPOT_CONTRACT = "0x1234567890123456789012345678901234567890"; // Replace with actual deployed contract
const USDC_ADDRESS = "0xA0b86a33E6441E681E618938aA0cf8Ef86C6d2d8"; // Base USDC
const ENTRY_FEE = parseUnits("0.1", 6); // 0.1 USDC

export function CastJackpotApp() {
  const { sdk, context, isSDKLoaded } = useMiniAppSdk();
  const { address, isConnected } = useAccount();
  const [isEntering, setIsEntering] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const { writeContract } = useWriteContract();
  
  const { data: currentJackpot } = useReadContract({
    address: JACKPOT_CONTRACT as `0x${string}`,
    abi: [{
      name: "getCurrentJackpot",
      type: "function",
      stateMutability: "view",
      inputs: [],
      outputs: [{ type: "uint256" }]
    }],
    functionName: "getCurrentJackpot"
  });

  const { data: currentEntries } = useReadContract({
    address: JACKPOT_CONTRACT as `0x${string}`,
    abi: [{
      name: "getCurrentRoundEntries",
      type: "function", 
      stateMutability: "view",
      inputs: [],
      outputs: [{ type: "uint256" }]
    }],
    functionName: "getCurrentRoundEntries"
  });

  const { data: hasEntered } = useReadContract({
    address: JACKPOT_CONTRACT as `0x${string}`,
    abi: [{
      name: "getUserEntryStatus",
      type: "function",
      stateMutability: "view", 
      inputs: [{ type: "address" }],
      outputs: [{ type: "bool" }]
    }],
    functionName: "getUserEntryStatus",
    args: address ? [address] : undefined
  });

  const handleEnterJackpot = async () => {
    if (!address) return;
    
    setIsEntering(true);
    try {
      await writeContract({
        address: JACKPOT_CONTRACT as `0x${string}`,
        abi: [{
          name: "enterJackpot",
          type: "function",
          stateMutability: "nonpayable",
          inputs: []
        }],
        functionName: "enterJackpot"
      });
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      console.error("Entry failed:", error);
    } finally {
      setIsEntering(false);
    }
  };

  const jackpotAmount = currentJackpot ? formatUnits(currentJackpot as bigint, 6) : "0";
  const totalEntries = currentEntries ? Number(currentEntries) : 0;

  if (!isSDKLoaded) {
    return (
      <div className="w-full max-w-md mx-auto p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-center mt-4 text-purple-600 font-semibold">Loading Cast Jackpot...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div key={i} className={`confetti confetti-${i % 5}`}></div>
            ))}
          </div>
        </div>
      )}

      {/* Header with gradient background */}
      <div className="text-center bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-3xl p-8 text-white shadow-2xl">
        <h1 className="text-4xl font-bold mb-2 animate-pulse">Cast Jackpot</h1>
        <p className="text-lg opacity-90">Win the community pot!</p>
        
        {/* Jackpot Display */}
        <div className="mt-6 bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
          <div className="text-5xl font-black mb-2 text-yellow-300 drop-shadow-lg">
            ${jackpotAmount} USDC
          </div>
          <div className="text-sm opacity-90">
            {totalEntries} players entered
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      {context?.user && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200">
          <CardContent className="p-6">
            <UserContext />
          </CardContent>
        </Card>
      )}

      {/* Entry Section */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-2xl font-bold text-green-800">
            Ready to Win?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="text-center py-4">
              <p className="text-green-700 mb-4">Connect your wallet to play!</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-2xl transform hover:scale-105 transition-all">
                Connect Wallet
              </Button>
            </div>
          ) : hasEntered ? (
            <div className="text-center py-4">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                You&apos;re In!
              </h3>
              <p className="text-green-600">
                Good luck in this round!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-green-700 font-semibold mb-4">
                  Entry Fee: 0.1 USDC
                </p>
              </div>
              
              {/* Payment Options */}
              <div className="space-y-3">
                <Button
                  onClick={handleEnterJackpot}
                  disabled={isEntering}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-2xl transform hover:scale-105 transition-all text-lg shadow-lg"
                >
                  {isEntering ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Entering...
                    </div>
                  ) : (
                    "Enter Jackpot"
                  )}
                </Button>
                
                {/* Alternative: Daimo Pay */}
                <div className="text-center text-sm text-gray-600">or</div>
                <DaimoPayTransferButton
                  text="Pay with Daimo"
                  toAddress={JACKPOT_CONTRACT}
                  amount="0.1"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share Section */}
      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-pink-800 mb-4">
            Spread the Buzz!
          </h3>
          <p className="text-pink-600 mb-4">
            Share with your frens and grow the jackpot!
          </p>
          <ShareCastButton
            text={`Just entered the Cast Jackpot! Current pot: $${jackpotAmount} USDC with ${totalEntries} players. Who wants to win big?`}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl transform hover:scale-105 transition-all"
          />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {totalEntries > 0 && (
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-indigo-800">
              Latest Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(Math.min(3, totalEntries))].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 bg-white/60 p-3 rounded-xl">
                  <Avatar className="h-8 w-8" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Player {totalEntries - i}</p>
                    <p className="text-xs text-gray-500">Just entered</p>
                  </div>
                  <div className="text-sm font-bold text-green-600">+$0.10</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>Powered by Base • Fair & Transparent</p>
      </div>

      <style jsx>{`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #ff6b6b;
          animation: confetti-fall 3s linear infinite;
        }
        
        .confetti-0 { background: #ff6b6b; left: 10%; animation-delay: 0s; }
        .confetti-1 { background: #4ecdc4; left: 30%; animation-delay: 0.2s; }
        .confetti-2 { background: #45b7d1; left: 50%; animation-delay: 0.4s; }
        .confetti-3 { background: #f9ca24; left: 70%; animation-delay: 0.6s; }
        .confetti-4 { background: #6c5ce7; left: 90%; animation-delay: 0.8s; }
        
        @keyframes confetti-fall {
          0% {
            top: -10px;
            transform: rotate(0deg);
          }
          100% {
            top: 100vh;
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}