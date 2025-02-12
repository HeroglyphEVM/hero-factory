/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Globe, Loader, MessageCircle, Upload } from "lucide-react"
import { TelegramIcon } from "@/components/icons/TelegramIcon"
import { XOutlinedIcon } from "@/components/icons/XOutlinedIcon"
import { z } from "zod"
import { TokenDescriptor, TokenData } from "@/types/token-types"
import { uploadImage, uploadTokenMetadata } from "@/services/pinata/pinataService"
import { Address, parseAbiItem } from "viem"
import { useContractWrite } from "@/hooks/useContractWrite"
import { TokenImage } from "@/components/token/TokenImage"

interface TokenSettingsFormProps {
  tokenDescriptor: TokenDescriptor
  tokenData: TokenData
}

const formSchema = z.object({
  description: z.string().max(500, "Description must be 500 characters or less"),
  website: z.string().url("Invalid URL").or(z.literal("")),
  telegram: z.string().startsWith("https://t.me/", { message: "Must be a valid Telegram URL" }).or(z.literal("")),
  x: z.string().startsWith("https://x.com/", { message: "Must be a valid X URL" }).or(z.literal("")),
  chat: z.string().url("Invalid URL").or(z.literal("")),
})

export const TokenSettingsForm: React.FC<TokenSettingsFormProps> = ({ tokenData, tokenDescriptor }) => {
  const [formData, setFormData] = useState<TokenDescriptor>({
    description: "",
    website: "",
    telegram: "",
    x: "",
    chat: "",
  })

  const [initialFormData, setInitialFormData] = useState<TokenDescriptor>({
    description: "",
    website: "",
    telegram: "",
    x: "",
    chat: "",
  })
  const [image, setImage] = useState<File>()
  const [errors, setErrors] = useState<Partial<z.inferFlattenedErrors<typeof formSchema>["fieldErrors"]>>({})
  const [isFormChanged, setIsFormChanged] = useState(false)
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isMetadataChanged, setIsMetadataChanged] = useState(false);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync, isMining, isSuccess } = useContractWrite({
    contractAddress: tokenData.address as Address,
    abi: [parseAbiItem("function setExternalMetadata(string, string)")],
  })

  const setTokenMetadata = async (imageHash: string, metadataHash: string) => {
    await writeContractAsync({
      functionName: "setExternalMetadata",
      args: [imageHash, metadataHash]
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsMetadataChanged(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setIsImageChanged(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let imageHash = tokenData.metadata.imageHash;
    let metadataHash = tokenData.metadata.descriptorHash;
    if (isMetadataChanged) {
      try {
        formSchema.parse(formData);
      } catch (error: any) {
        console.log("Error:", error);
        setErrors(error.flatten().fieldErrors);
        setIsLoading(false);
        return;
      }
      setErrors({});
      const metadata = await uploadTokenMetadata(formData);
      metadataHash = metadata.IpfsHash;
    }

    if (isImageChanged && image) {
      const upload = await uploadImage(image);
      imageHash = upload.IpfsHash;
    }

    await setTokenMetadata(imageHash, metadataHash);
    setIsLoading(false);
  };

  const imagePreview = useMemo(() => {
    return image ? URL.createObjectURL(image) : tokenData?.image ? tokenData.image : ""
  }, [image, tokenData?.image])

  useEffect(() => {
    if (tokenDescriptor) {
      const newFormData = {
        description: tokenDescriptor.description,
        website: tokenDescriptor.website,
        telegram: tokenDescriptor.telegram,
        x: tokenDescriptor.x,
        chat: tokenDescriptor.chat,
      }
      setFormData(newFormData)
      setInitialFormData(newFormData)
    }
  }, [tokenDescriptor])

  useEffect(() => {
    setIsFormChanged(JSON.stringify(formData) !== JSON.stringify(initialFormData))
  }, [formData, initialFormData])

  useEffect(() => {
    if (isSuccess) {
      setIsSuccessMessageVisible(true);
      setTimeout(() => {
        setIsSuccessMessageVisible(false);
      }, 5000);
    }
  }, [isSuccess]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Admin Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 ">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Update Token Image</h3>
            <div className="flex items-center space-x-4">
              <TokenImage className="h-24 w-24" image={imagePreview} tokenAddress={tokenData.address} />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="token-image-upload"
              />


              <Label htmlFor="token-image-upload" className="cursor-pointer">
                <div className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Image
                </div>
              </Label>

            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Token Description</h3>
            <Textarea
              name="description"
              placeholder="Enter token description"
              value={formData.description}
              onChange={handleInputChange}
              className="text-white"
              />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>}
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Website</h3>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <Input
                  name="website"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="text-white"

                />
              </div>
              {errors.website && <p className="text-red-500 text-sm mt-1 ml-8">{errors.website[0]}</p>}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Social Links</h3>
            <div className="space-y-2">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <TelegramIcon className="h-5 w-5 " />
                  <Input
                    name="telegram"
                    placeholder="https://t.me/"
                    value={formData.telegram}
                    onChange={handleInputChange}
                    className="text-white"

                  />
                </div>
                {errors.telegram && <p className="text-red-500 text-sm mt-1 ml-8">{errors.telegram[0]}</p>}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <XOutlinedIcon className="h-5 w-5 " />
                  <Input
                    name="x"
                    placeholder="https://x.com/"
                    value={formData.x}
                    onChange={handleInputChange}
                    className="text-white"

                  />
                </div>
                {errors.x && <p className="text-red-500 text-sm mt-1 ml-8">{errors.x[0]}</p>}
              </div>
              <div className="flex flex-col">

                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 " />
                  <Input
                    name="chat"
                    placeholder="Chat Link"
                    value={formData.chat}
                    onChange={handleInputChange}
                    className="text-white"

                  />
                </div>
                {errors.chat && <p className="text-red-500 text-sm mt-1 ml-8">{errors.chat[0]}</p>}
              </div>
            </div>
          </div>
          {isSuccessMessageVisible && <p className="text-green-700">Changes have been saved!</p>}
          <Button
            type="submit"
            className="w-full"
            disabled={(!isFormChanged && !isImageChanged) || isMining || isLoading}
          >
            {(isMining || isLoading) && <Loader className="mr-2 h-5 w-5 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}