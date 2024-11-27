import { useState } from "react";
import { generateMnemonic } from "bip39";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Copy } from "lucide-react";
import { Solana } from "./components/solana";


function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [secretPhrase, setSecretPhrase] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateMnemonic = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
    setSecretPhrase(mnemonic.split(" "));
  };


  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-4">Web3 Wallet</h1>

        {/* Secret Phrase Section */}
        <Card className="bg-[#121212] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white text-3xl font-bold">
              Your Secret Phrase
            </CardTitle>
          </CardHeader>
          {secretPhrase.length === 0 && (
            <Button variant="destructive" onClick={handleGenerateMnemonic}>
              Generate New Mnemonic
            </Button>
          )}
          <CardContent>
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 cursor-pointer"
              onClick={() => copyToClipboard(secretPhrase.join(" "))}
            >
              {secretPhrase.map((word, index) => (
                <div
                  key={index}
                  className="bg-[#1a1a1a] p-4 rounded-lg text-gray-300 hover:bg-[#222222] transition-colors"
                >
                  {word}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Click Anywhere To Copy
              {copied && <span className="text-green-500">Copied!</span>}
            </div>
          </CardContent>
        </Card>
        {mnemonic.length !== 0 && <Solana mnemonic={mnemonic} />}
        {mnemonic.length === 0 && <div className="text-red-600">Please generate a mnemonic first!</div>}
      </div>
    </div>
  );
}

export default App;
