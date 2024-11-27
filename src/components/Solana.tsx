import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import axios from "axios";
import { mnemonicToSeed } from "bip39";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useState } from "react";
import { SOL } from "../config";

export function Solana({ mnemonic }: { mnemonic: string }) {
    const [showPrivateKeys, setShowPrivateKeys] = useState<Record<number, boolean>>({});
    const [wallets, setWallets] = useState<
        { publicKey: string; privateKey: string; balance: number }[]
    >([]);
    const getSolBalance = async (solAddress: string) => {
        try {
          const res = await axios.post(
            SOL,
            {
              jsonrpc: "2.0",
              id: 1,
              method: "getBalance",
              params: [solAddress],
            }
          );
      
          // Convert balance from Wei to Ether
          const balanceInLamports = res.data.result.value; // Balance in lamports
          const balanceInSOL = balanceInLamports / 1e9;
      
          console.log(`Balance: ${balanceInSOL} ETH`);
          return balanceInSOL;
        } catch (error) {
          console.error("Error fetching balance");
          throw error;
        }
      };
    
      const handleAddWallet = async () => {
        if (!mnemonic) return alert("Please generate a mnemonic first!");
        const seed = await mnemonicToSeed(mnemonic);
        const path = `m/44'/501'/${wallets.length}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keyPair = Keypair.fromSecretKey(secret);
        const secretKeyBase58 = bs58.encode(keyPair.secretKey);
        const balance = await getSolBalance(keyPair.publicKey.toString());
    
        setWallets([
          ...wallets,
          {
            publicKey: keyPair.publicKey.toString(),
            privateKey: secretKeyBase58,
            balance: balance
            
          },
        ]);
      };
    
      const handleClearWallets = () => {
        setWallets([]);
        setShowPrivateKeys({});
      };
    
      const toggleShowPrivateKey = (index: number) => {
        setShowPrivateKeys((prev) => ({
          ...prev,
          [index]: !prev[index],
        }));
      };
    
      return (
        <div>
            {/* Solana Wallet Section */}
            <Card className="bg-[#121212] border-gray-800 mt-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white text-2xl">Solana Wallets</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-200"
                    onClick={handleAddWallet}
                  >
                    Add Wallet
                  </Button>
                  <Button variant="destructive" onClick={handleClearWallets}>
                    Clear Wallets
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {wallets.map((wallet, index) => (
                  <Card key={index} className="bg-[#1a1a1a] border-gray-800 mb-4">
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle className="text-xl text-white flex">
                          Wallet {index + 1}
                        </CardTitle>
                        <div className="text-white">{wallet.balance} SOL</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-400">Public Key</div>
                        <div className="font-mono text-sm break-all text-white">
                          {wallet.publicKey}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-400">Private Key</div>
                        <div className="font-mono text-sm break-all flex justify-between items-center">
                          <div
                            className={cn(
                              showPrivateKeys[index] ? "text-white" : "filter blur-sm select-none text-white"
                            )}
                          >
                            {showPrivateKeys[index]
                              ? wallet.privateKey.toString()
                              : "•".repeat(64)}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleShowPrivateKey(index)}
                            className="ml-2"
                          >
                            {showPrivateKeys[index] ? (
                              <EyeOff className="h-4 w-4 text-white hover:text-black" />
                            ) : (
                              <Eye className="h-4 w-4 text-white hover:text-black" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
      );
}