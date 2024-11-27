import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

interface SendModalProps {
  isOpen: boolean
  onClose: () => void
  Chain: string
}

export default function SendModal({ isOpen, onClose, Chain }: SendModalProps) {
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')

  const handleSend = () => {
    // implement the actual send functionality
    console.log(`Sending ${amount} ETH to ${address}`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] text-white">
        <DialogHeader>
          <DialogTitle>Send {Chain}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({Chain})</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-[#2a2a2a] border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Recipient Address</Label>
            <Input
              id="address"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-[#2a2a2a] border-gray-700 text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="bg-gray-700 text-white hover:bg-gray-900 hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleSend} className="bg-blue-600 text-white hover:bg-blue-700">
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

