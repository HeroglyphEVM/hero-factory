import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "./button"

export const CopyButton = ({ value, className }: { value: string; className?: string }) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 500)
  }

  return (
    <Button variant="ghost" size="icon" className={className} onClick={copyToClipboard}>
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}