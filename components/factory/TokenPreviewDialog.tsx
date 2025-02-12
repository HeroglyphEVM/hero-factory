import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Address, Hex, keccak256, parseAbi, parseUnits, toHex } from "viem"
import { TOKEN_RECIPE_ADDRESS } from "@/services/web3/constants"
import { useContractWrite } from "@/hooks/useContractWrite"
import { useAccount, useConfig } from "wagmi"
import { getTransactionReceipt } from "wagmi/actions"
import { TokenFormData } from "./factory-types"
import { beautifyAddress } from "@/utils/web3"
import { PreviewInfoItem } from "./PreviewInfoItem"
import { useMemo, useState } from "react"
import Image from "next/image"
import { uploadImage } from "@/services/pinata/pinataService"

type TokenPreviewProps = {
  formData: TokenFormData
  isOpen: boolean
  onClose: () => void
  onTokenCreated: (tokenAddress: string) => void
}

const RECIPE_ABI = [
  'function createHeroToken(string memory tokenName, string memory tokenSymbol, uint256 maxSupply, uint256 preMintAmount, uint256 rewardPerBlock, uint256 maxBonusRewardAfterOneDay, address owner, string) external returns (address)',
  'function createCustomHeroToken(string memory tokenName, string memory tokenSymbol, uint32 crossChainFee, uint32 lzGasLimit, uint256 maxSupply, uint256 preMintAmount, address treasury, address feePayer, uint256 rewardPerBlock, uint256 maxBonusRewardAfterOneDay, address owner, string) external returns (address)',
];

export const TokenPreviewDialog = ({
  isOpen,
  onClose,
  onTokenCreated,
  formData
}: TokenPreviewProps) => {

  const [loading, setLoading] = useState(false)

  const { address } = useAccount() as { address: Address }
  const config = useConfig();

  const { writeContractAsync, isMining } = useContractWrite({
    contractAddress: TOKEN_RECIPE_ADDRESS,
    abi: parseAbi(RECIPE_ABI),
  })

  const handleDeploy = async () => {
    if (!formData.image) return;
    let args: any[] = [];

    setLoading(true);
    try {
      const upload = await uploadImage(formData.image);
      const imageHash = upload.IpfsHash;

      if (!formData.isPro) {
        args = [
          formData.coinName,
          formData.symbol,
          parseUnits(formData.maxSupply, 18),
          parseUnits(formData.preMintAmount, 18),
          parseUnits(formData.rewardsPerBlock, 18),
          parseUnits(formData.maxBonusRewardAfterOneDay, 18),
          address,
          imageHash
        ]
      } else {
        args = [
          formData.coinName,
          formData.symbol,
          formData.crossChainFee,
          formData.lzGasLimit,
          parseUnits(formData.maxSupply, 18),
          parseUnits(formData.preMintAmount, 18),
          formData.treasury,
          formData.feePayer,
          parseUnits(formData.rewardsPerBlock, 18),
          parseUnits(formData.maxBonusRewardAfterOneDay, 18),
          formData.owner,
          imageHash
        ]
      }

      const tx = await writeContractAsync({
        functionName: !formData.isPro ? "createHeroToken" : "createCustomHeroToken",
        args
      })

      const receipt = await getTransactionReceipt(config, { hash: tx as Hex });
      const heroTokenCreatedTopic = keccak256(toHex('HeroTokenCreated(address,address,uint256)'));
      const heroTokenCreatedEvent = receipt.logs.find(log =>
        log.topics[0] === heroTokenCreatedTopic
      );
      if (heroTokenCreatedEvent && heroTokenCreatedEvent.topics[1]) {
        const tokenAddress = `0x${heroTokenCreatedEvent.topics[1].slice(26)}` as `0x${string}`;
        onTokenCreated(tokenAddress);
      } else {
        console.error('HeroTokenCreated event not found in transaction logs');
      }
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

  const imagePreview = useMemo(() => {
    return formData.image ? URL.createObjectURL(formData.image) : ""
  }, [formData.image])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onInteractOutside={(e) => {
        e.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Coin Preview</DialogTitle>
          <DialogDescription>Review your coin details before deployment</DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-6">
          <div className="rounded-full w-32 h-32 mx-auto flex items-center justify-center">
            <Image src={imagePreview} alt="Token preview" className="w-full h-full object-cover rounded-full" width={100} height={100} />
          </div>
          <h2 className="text-center text-2xl font-bold">{formData.coinName}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <PreviewInfoItem label="Symbol" value={formData.symbol || "???"} />
            <PreviewInfoItem label="Supply" value={formData.maxSupply || "0"} />
            <PreviewInfoItem label="Rewards Per Block" value={formData.rewardsPerBlock || "0"} />
            <PreviewInfoItem label="Max Bonus Reward" value={formData.maxBonusRewardAfterOneDay || "0"} />
            <PreviewInfoItem label="Pre-Mint Amount" value={formData.preMintAmount || "0"} colSpan={2} />
            {formData.isPro && (
              <>
                <PreviewInfoItem label="Treasury" value={beautifyAddress(formData.treasury)} />
                <PreviewInfoItem label="Fee Payer" value={beautifyAddress(formData.feePayer)} />
                <PreviewInfoItem label="Cross Chain Fee" value={formData.crossChainFee} />
                <PreviewInfoItem label="LZ Gas Limit" value={formData.lzGasLimit} />
                <PreviewInfoItem label="Owner" value={beautifyAddress(formData.owner)} />
              </>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            onClick={handleDeploy}
            disabled={isMining || loading}
          >
            {isMining ? "Deploying..." : loading ? "Uploading image..." : "Deploy Token"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
