import { mnemonicToSeed } from "bip39";
import { Wallet } from "ethers";
import { HDNodeWallet } from "ethers";
import { useState } from "react";

export function EtheriumWallet({ mnemonic }: { mnemonic: string }) {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [publicKeys, setPublicKeys] = useState<string[]>([]);
    return <div>
        <button onClick={async () => {
            const seed = await mnemonicToSeed(mnemonic);
            const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
            const hNode = HDNodeWallet.fromSeed(seed);
            const child = hNode.derivePath(derivationPath);
            const privateKey = child.privateKey;
            const wallet = new Wallet(privateKey);
            setCurrentIndex(currentIndex + 1);
            setPublicKeys([...publicKeys, wallet.address]);
        }}>Add Etherium Wallet</button>
        {publicKeys.map((key, index) => <div key={index}>ETH Public Key: {key}</div>)}
    </div>    
}