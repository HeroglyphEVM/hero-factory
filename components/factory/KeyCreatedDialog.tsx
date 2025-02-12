import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { TokenImage } from "@/components/token/TokenImage"
import { useMemo } from "react"

type KeyCreatedProps = {
  symbol: string
  keyName: string
  keyAddress: string
  isOpen: boolean
  image: File | null
  onClose: () => void
}

export const KeyCreatedDialog = ({ isOpen, onClose, symbol, keyName, keyAddress, image }: KeyCreatedProps) => {

  const imagePreview = useMemo(() => image ? URL.createObjectURL(image) : "", [image])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Key Deployed Successfully!</DialogTitle>
        </DialogHeader>
        <div className="py-6 flex flex-col items-center">
          <TokenImage
            image={imagePreview}
            tokenAddress={keyAddress}
            className="h-24 w-24 mb-4"
          />
          <h2 className="text-xl font-semibold mb-1">{keyName}</h2>
          <p className="text-muted-foreground mb-6">${symbol}</p>
          <Link href={`/keys/${keyAddress}`} passHref>
            <Button 
              className="w-full"
              onClick={onClose}
            >
              View Key Page
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
