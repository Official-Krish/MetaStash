import { useState } from "react";
import { generateMnemonic } from "bip39";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Copy } from "lucide-react";
import { Solana } from "./components/solana";
import { Etherium } from "./components/Etherium";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import Appbar from "./components/Appbar";
import Footer from "./components/Footer";
import { Input } from "./components/ui/input";


function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [secretPhrase, setSecretPhrase] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"SOLANA" | "ETHEREUM">("SOLANA");
  const [inputMnemonic, setInputMnemonic] = useState("");
  const [error, setError] = useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
    setSecretPhrase(newMnemonic.split(" "));
    setError("");
  };

  const handleInputMnemonic = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMnemonic(e.target.value);
  };

  const handleSubmitMnemonic = () => {
    setMnemonic(inputMnemonic);
    setSecretPhrase(inputMnemonic.split(" "));
    setError("");
  };

  return (
    <div className="bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6 min-h-screen">
        <Appbar />
        {/* Secret Phrase Section */}
        <Card className="bg-[#121212] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white text-3xl font-bold">
              Your Secret Phrase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!mnemonic && (
              <div>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter your mnemonic"
                    value={inputMnemonic}
                    onChange={handleInputMnemonic}
                    className="flex-grow bg-[#1a1a1a] text-white border-gray-700"
                  />
                  <Button onClick={handleSubmitMnemonic} variant="secondary">
                    Submit
                  </Button>
                </div>
              
              <div className="flex justify-between items-center pt-4">
                <Button variant="destructive" onClick={handleGenerateMnemonic}>
                  Generate New Mnemonic
                </Button>
                {error && <p className="text-red-500">{error}</p>}
              </div>
            </div>
            )}
            {secretPhrase.length > 0 && (
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
            )}
            {secretPhrase.length > 0 && (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Click Anywhere To Copy
                {copied && <span className="text-green-500">Copied!</span>}
              </div>
            )}
          </CardContent>
        </Card>
        {mnemonic && (
          <div>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "SOLANA" | "ETHEREUM")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="SOLANA">Solana</TabsTrigger>
                <TabsTrigger value="ETHEREUM">Ethereum</TabsTrigger>
              </TabsList>
              <TabsContent value="SOLANA">
                <Solana mnemonic={mnemonic} />
              </TabsContent>
              <TabsContent value="ETHEREUM">
                <Etherium mnemonic={mnemonic} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
