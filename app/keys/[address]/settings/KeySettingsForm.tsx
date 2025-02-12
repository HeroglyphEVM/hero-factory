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
import { KeyDescriptor, KeyData } from "@/types/key-types"
import { uploadImage, uploadTokenMetadata } from "@/services/pinata/pinataService"
import { Address, parseAbi, parseAbiItem } from "viem"
import { useContractWrite } from "@/hooks/useContractWrite"
import { KeyImage } from "@/components/token/KeyImage"

interface KeySettingsFormProps {
  keyDescriptor: KeyDescriptor
  keyData: KeyData
}

const formSchema = z.object({
  description: z.string().max(500, "Description must be 500 characters or less"),
  website: z.string().url("Invalid URL").or(z.literal("")),
  telegram: z.string().startsWith("https://t.me/", { message: "Must be a valid Telegram URL" }).or(z.literal("")),
  x: z.string().startsWith("https://x.com/", { message: "Must be a valid X URL" }).or(z.literal("")),
  chat: z.string().url("Invalid URL").or(z.literal("")),
})

const KEY_CONTRACT_ABI = [
  "function setMetadata(ExternalMetadata memory _metadata)",
  "struct ExternalMetadata { string imageURI; string metadata; }"
]

export const KeySettingsForm: React.FC<KeySettingsFormProps> = ({ keyData, keyDescriptor }) => {
  const [formData, setFormData] = useState<KeyDescriptor>({
    description: "",
    website: "",
    telegram: "",
    x: "",
    chat: "",
  })

  const [initialFormData, setInitialFormData] = useState<KeyDescriptor>({
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
    contractAddress: keyData.address as Address,
    abi: parseAbi(KEY_CONTRACT_ABI),
  })

  const setKeyMetadata = async (imageHash: string, metadataHash: string) => {
    const metadata = {
      imageURI: imageHash,
      metadata: metadataHash,
    }
    console.log("metadata", metadata)
    await writeContractAsync({
      functionName: "setMetadata",
      args: [metadata]
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
    let imageHash = keyData.metadata.imageHash;
    let metadataHash = keyData.metadata.descriptorHash;
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

    await setKeyMetadata(imageHash, metadataHash);
    setIsLoading(false);
  };

  const imagePreview = useMemo(() => {
    return image ? URL.createObjectURL(image) : keyData?.image ? keyData.image : ""
  }, [image, keyData?.image])

  useEffect(() => {
    if (keyDescriptor) {
      const newFormData = {
        description: keyDescriptor.description,
        website: keyDescriptor.website,
        telegram: keyDescriptor.telegram,
        x: keyDescriptor.x,
        chat: keyDescriptor.chat,
      }
      setFormData(newFormData)
      setInitialFormData(newFormData)
    }
  }, [keyDescriptor])

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
            <h3 className="mb-2 text-lg font-semibold">Update Key Image</h3>
            <div className="flex items-center space-x-4">
              <KeyImage className="h-24 w-24" image={imagePreview} keyAddress={keyData.address} />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="key-image-upload"
              />


              <Label htmlFor="key-image-upload" className="cursor-pointer">
                <div className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Image
                </div>
              </Label>

            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Key Description</h3>
            <Textarea
              name="description"
              placeholder="Enter key description"
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