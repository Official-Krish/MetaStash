import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useState } from "react";
import { ETH } from "../config";
import { mnemonicToSeed } from "bip39";
import { HDNodeWallet, Wallet } from "ethers";

export function Etherium({ mnemonic }: { mnemonic: string }) {
    const [showPrivateKeys, setShowPrivateKeys] = useState<Record<number, boolean>>({});
    const [wallets, setWallets] = useState<
        { publicKey: string; privateKey: string; balance: number }[]
    >([]);

    const getEthBalance = async (ethAddress: string) => {
        console.log(ethAddress)
        try {
          const res = await axios.post(
            ETH,
            {
              jsonrpc: "2.0",
              id: 1,
              method: "eth_getBalance",
              params: [ethAddress, "latest"],
            }
          );
      
          // Convert balance from Wei to Ether
          const balanceInWei = res.data.result;
            const balanceInEther = parseFloat(
            (parseInt(balanceInWei, 16) / 1e18).toFixed(18)
            );
          return balanceInEther;
        } catch (error) {
          console.error("Error fetching balance");
          throw error;
        }
      };
    
      const handleAddWallet = async () => {
        if (!mnemonic) return alert("Please generate a mnemonic first!");
        const seed = await mnemonicToSeed(mnemonic);
        const derivationPath = `m/44'/60'/${wallets.length}'/0'`;
        const hNode = HDNodeWallet.fromSeed(seed);
        const child = hNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        const balance = await getEthBalance(wallet.address.toString());

        setWallets([
          ...wallets,
          {
            publicKey: wallet.address.toString(),
            privateKey: privateKey,
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
                <CardTitle className="text-white text-2xl">Ethereum Wallets</CardTitle>
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
                        <div className="text-white">{wallet.balance} ETH</div>
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