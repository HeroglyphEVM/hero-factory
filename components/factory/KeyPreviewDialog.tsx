import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Hex, keccak256, parseAbi, parseUnits, toHex } from "viem";
import { KEY_RECIPE_ADDRESS } from "@/services/web3/constants";
import { useContractWrite } from "@/hooks/useContractWrite";
import { useAccount, useConfig } from "wagmi";
import { getTransactionReceipt } from "wagmi/actions";
import { KeyFormData } from "./factory-types";
import { beautifyAddress } from "@/utils/web3";
import { PreviewInfoItem } from "./PreviewInfoItem";
import { uploadImage } from "@/services/pinata/pinataService";
import Image from "next/image";

type KeyPreviewProps = {
  formData: KeyFormData;
  isOpen: boolean;
  onClose: () => void;
  onKeyCreated: (keyAddress: string) => void;
};

const KEY_RECIPE_ABI = [
  "function createHeroKey(string memory tokenName, string memory tokenSymbol, uint256 maxSupply, address owner, string memory imageURI) external returns (address)",
  "function createCustomHeroKey(HeroKeyParams memory params) external returns (address)",
  "struct HeroKeyParams {string tokenName;string tokenSymbol;uint256 maxSupply;address treasury;address feePayer;address owner;string displayName;string imageURI;address key;address paymentToken;uint256 baseCost;uint256 costIncrement;uint32 lzGasLimit;}",
];

export const KeyPreviewDialog = ({
  isOpen,
  onClose,
  onKeyCreated,
  formData,
}: KeyPreviewProps) => {
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const config = useConfig();

  const { writeContractAsync, isMining } = useContractWrite({
    contractAddress: KEY_RECIPE_ADDRESS,
    abi: parseAbi(KEY_RECIPE_ABI),
  });

  const handleDeploy = async () => {
    if (!formData.image) return;
    setLoading(true);
    try {
      const upload = await uploadImage(formData.image);
      const imageHash = upload.IpfsHash;

      let args = [];

      if (!formData.isPro) {
        args = [
          formData.keyName,
          formData.symbol,
          formData.maxSupply,
          address,
          imageHash,
        ];
      } else {
        args = [
          {
            tokenName: formData.keyName,
            tokenSymbol: formData.symbol,
            maxSupply: formData.maxSupply,
            treasury: formData.treasury,
            feePayer: formData.feePayer,
            owner: formData.owner,
            displayName: formData.keyName,
            imageURI: imageHash,
            key: address,
            paymentToken: address,
            baseCost: formData.baseCost ? parseUnits(formData.baseCost, 18) : 0,
            costIncrement: formData.costIncrement
              ? parseUnits(formData.costIncrement, 18)
              : 0,
            lzGasLimit: formData.lzGasLimit,
          },
        ];
      }
      const tx = await writeContractAsync({
        functionName: !formData.isPro ? "createHeroKey" : "createCustomHeroKey",
        args,
      });

      if (tx) {
        const receipt = await getTransactionReceipt(config, {
          hash: tx as Hex,
        });
        const heroTokenCreatedTopic = keccak256(
          toHex("HeroKeyCreated(address,address,uint256)")
        );
        const heroTokenCreatedEvent = receipt.logs.find(
          (log) => log.topics[0] === heroTokenCreatedTopic
        );
        if (heroTokenCreatedEvent && heroTokenCreatedEvent.topics[1]) {
          const tokenAddress = `0x${heroTokenCreatedEvent.topics[1].slice(
            26
          )}` as `0x${string}`;
          onKeyCreated(tokenAddress);
        } else {
          console.error("HeroTokenCreated event not found in transaction logs");
        }
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error deploying key:", error);
    } finally {
      setLoading(false);
    }
  };

  const imagePreview = useMemo(() => {
    return formData.image ? URL.createObjectURL(formData.image) : "";
  }, [formData.image]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Key Preview</DialogTitle>
          <DialogDescription>
            Review your key details before deployment
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-6">
          <div className="rounded-full w-32 h-32 mx-auto flex items-center justify-center">
            <Image
              src={imagePreview}
              alt="Token preview"
              className="w-full h-full object-cover rounded-full"
              width={100}
              height={100}
            />
          </div>
          <h2 className="text-center text-2xl font-bold">
            {formData.keyName || "Your Key"}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <PreviewInfoItem label="Symbol" value={formData.symbol} />
            <PreviewInfoItem label="Supply" value={formData.maxSupply} />
            <PreviewInfoItem
              label="Max Keys"
              value={formData.maxSupply}
              colSpan={2}
            />
            {formData.isPro && (
              <>
                <PreviewInfoItem label="Base Cost" value={formData.baseCost} />
                <PreviewInfoItem
                  label="Cost Increment"
                  value={formData.costIncrement}
                />
                <PreviewInfoItem
                  label="Payment Token"
                  value={beautifyAddress(formData.paymentToken)}
                />
                <PreviewInfoItem
                  label="Treasury"
                  value={beautifyAddress(formData.treasury)}
                />
                <PreviewInfoItem
                  label="Fee Payer"
                  value={beautifyAddress(formData.feePayer)}
                />
                <PreviewInfoItem
                  label="Owner"
                  value={beautifyAddress(formData.owner)}
                />
                <PreviewInfoItem
                  label="LZ Gas Limit"
                  value={formData.lzGasLimit}
                />
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
            {isMining
              ? "Deploying..."
              : loading
              ? "Uploading image..."
              : "Deploy Key"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
