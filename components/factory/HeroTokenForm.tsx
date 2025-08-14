import { useState } from "react";
import { Rocket } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { HeroTokenFormType } from "./factory-types";
import { Switch } from "../ui/switch";
import { ImageUploader } from "./ImageUploader";

type FormErrors = {
  [K in keyof HeroTokenFormType]?: string;
};

const errorMessages: {
  [key: string]: (value: string, maxSupply?: string) => string;
} = {
  type: (value) => (value.trim() == "hero" ? "" : "Type must be hero"),
  coinName: (value) => (value.trim() ? "" : "Coin name is required"),
  symbol: (value) => (value.trim() ? "" : "Symbol is required"),
  maxSupply: (value) =>
    !value || isNaN(Number(value)) || Number(value) <= 0
      ? "Max supply must be a positive number"
      : Number(value) > 1e15
      ? "Max supply must be less than 1 quadrillion"
      : "",
  preMintAmount: (value, maxSupply) => {
    if (!value || isNaN(Number(value)) || Number(value) < 0)
      return "Pre-mint amount must be a non-negative number";
    if (maxSupply && Number(value) > Number(maxSupply))
      return "Pre-mint amount cannot be larger than max supply";
    return "";
  },
  rewardsPerBlock: (value) =>
    !value || isNaN(Number(value)) || Number(value) < 0
      ? "Rewards per graffiti must be a non-negative number"
      : "",
  taxRate: (value) =>
    !value || isNaN(Number(value)) || Number(value) < 0
      ? "Tax rate must be a non-negative number"
      : "",
  crossChainFee: (value) =>
    !value || isNaN(Number(value)) || Number(value) < 0
      ? "Cross-chain fee must be a non-negative number"
      : "",
  lzGasLimit: (value) =>
    !value || isNaN(Number(value)) || Number(value) <= 0
      ? "LayerZero gas limit must be a positive number"
      : "",
  maxBonusRewardAfterOneDay: (value) =>
    !value || isNaN(Number(value)) || Number(value) < 0
      ? "Max bonus reward must be a non-negative number"
      : "",
  treasury: (value) =>
    /^0x[a-fA-F0-9]{40}$/.test(value) ? "" : "Invalid Ethereum address",
  feePayer: (value) =>
    /^0x[a-fA-F0-9]{40}$/.test(value) ? "" : "Invalid Ethereum address",
  owner: (value) =>
    /^0x[a-fA-F0-9]{40}$/.test(value) ? "" : "Invalid Ethereum address",
  image: (value) => (value ? "" : "Image is required"),
};

export const HeroTokenForm = ({
  onFormSubmit,
}: {
  onFormSubmit: (formData: HeroTokenFormType) => void;
}) => {
  const [formData, setFormData] = useState<HeroTokenFormType>({
    isPro: false,
    type: "hero",
    coinName: "",
    symbol: "",
    maxSupply: "",
    preMintAmount: "",
    rewardsPerBlock: "",
    maxBonusRewardAfterOneDay: "",
    treasury: "",
    feePayer: "",
    crossChainFee: "",
    lzGasLimit: "",
    owner: "",
    image: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (errors[id as keyof HeroTokenFormType]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (
        key === "isPro" ||
        (!formData.isPro &&
          [
            "treasury",
            "feePayer",
            "crossChainFee",
            "lzGasLimit",
            "owner",
          ].includes(key))
      ) {
        return;
      }
      const value = formData[key as keyof HeroTokenFormType];
      if (typeof value === "string") {
        const errorMessage = errorMessages[key](value, formData.maxSupply);
        if (errorMessage) {
          newErrors[key as keyof HeroTokenFormType] = errorMessage;
          isValid = false;
        }
      }
    });
    if (!formData.image) {
      newErrors.image = "Image is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleCreate = () => {
    if (validateForm()) {
      onFormSubmit(formData);
    }
  };

  const renderInput = (
    id: keyof HeroTokenFormType,
    label: string,
    placeholder: string,
    type = "text"
  ) => (
    <div>
      <Label htmlFor={id} className="text-white font-bold">
        {label}
      </Label>
      <div
        className={`flex items-center ${
          errors[id] ? "border border-red-500 rounded-md" : ""
        }`}
      >
        {id === "symbol" && <span className="pl-3 pr-2 text-gray-500">$</span>}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={String(formData[id])}
          onChange={handleInputChange}
          className={`flex-grow ${errors[id] ? "border-0" : ""}`}
        />
      </div>
      {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id]}</p>}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row justify-between items-center">
            HeroToken (ERC20)
            <div className="flex justify-end items-center">
              <div className="flex items-center space-x-2 text-xs">
                <span>Pro</span>
                <Switch
                  checked={formData.isPro}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isPro: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renderInput("coinName", "Token Name", "Enter your token name")}
          {renderInput("symbol", "Token Symbol", "Enter your token symbol")}
          {renderInput("maxSupply", "Max Supply", "Enter max supply", "number")}
          {renderInput(
            "preMintAmount",
            "Pre Mint Amount",
            "Enter pre-mint amount",
            "number"
          )}
          {renderInput(
            "rewardsPerBlock",
            "Rewards per block",
            "Enter rewards per block",
            "number"
          )}
          {renderInput(
            "maxBonusRewardAfterOneDay",
            "Max Bonus Reward After One Day",
            "Enter max bonus reward after one day",
            "number"
          )}

          {formData.isPro && (
            <>
              {renderInput(
                "treasury",
                "Treasury",
                "Enter treasury address",
                "text"
              )}
              {renderInput(
                "feePayer",
                "Fee Payer",
                "Enter fee payer address",
                "text"
              )}
              {renderInput(
                "crossChainFee",
                "Cross Chain Fee",
                "Enter cross chain fee",
                "number"
              )}
              {renderInput(
                "lzGasLimit",
                "LayerZero Gas Limit",
                "Enter layer zero gas limit",
                "number"
              )}
              {renderInput("owner", "Owner", "Enter owner address", "text")}
            </>
          )}
          <ImageUploader onChange={handleImageChange} />
          {errors["image"] && (
            <p className="text-red-500 text-sm mt-1">{errors["image"]}</p>
          )}
          <Button
            onClick={handleCreate}
            className="w-full bg-muted hover:bg-muted/60"
          >
            <Rocket className="mr-2 h-4 w-4 " />{" "}
            <span className="text-yellow-500 font-bold">Create Token</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
