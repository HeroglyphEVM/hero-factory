/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader } from "lucide-react"
import { z } from "zod"
import { KeyData } from "@/types/key-types"
import { Address, parseAbi, isAddress } from "viem"
import { useContractWrite } from "@/hooks/useContractWrite"
import { useContractQuery } from "@/hooks/useContractQuery"

interface KeySettingsFormProps {
  keyData: KeyData
}

const KEY_CONTRACT_ABI = [
  "function setKey(address _key)",
  "function key() view returns (address)",
]

const formSchema = z.object({
  mintKeyAddress: z.string().refine(isAddress, "Invalid Ethereum address"),
})

export const KeySettingsMintKey: React.FC<KeySettingsFormProps> = ({ keyData }) => {
  const { data: currentMintKeyAddress, isLoading: isMintKeyLoading } = useContractQuery({
    contractAddress: keyData.address as Address,
    abi: parseAbi(KEY_CONTRACT_ABI),
    functionName: "key",
  })

  const [formData, setFormData] = useState({ mintKeyAddress: "" })
  const [initialFormData, setInitialFormData] = useState({ mintKeyAddress: "" })
  const [errors, setErrors] = useState<Partial<z.inferFlattenedErrors<typeof formSchema>["fieldErrors"]>>({})
  const [isFormChanged, setIsFormChanged] = useState(false)
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { writeContractAsync, isMining, isSuccess } = useContractWrite({
    contractAddress: keyData.address as Address,
    abi: parseAbi(KEY_CONTRACT_ABI),
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      formSchema.parse(formData)
      await writeContractAsync({
        functionName: "setKey",
        args: [formData.mintKeyAddress as Address]
      })
      setInitialFormData(formData)
    } catch (error: any) {
      console.log("Error:", error)
      setErrors(error.flatten().fieldErrors)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsFormChanged(JSON.stringify(formData) !== JSON.stringify(initialFormData))
  }, [formData, initialFormData])

  useEffect(() => {
    if (isSuccess) {
      setIsSuccessMessageVisible(true)
      setTimeout(() => {
        setIsSuccessMessageVisible(false)
      }, 5000)
    }
  }, [isSuccess])

  useEffect(() => {
    if (currentMintKeyAddress) {
      setFormData({ mintKeyAddress: currentMintKeyAddress })
      setInitialFormData({ mintKeyAddress: currentMintKeyAddress })
    }
  }, [currentMintKeyAddress])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Update Mint Key Address</CardTitle>
        <CardDescription>
          The mint key optional. Will require users to have at least one of these tokens to be able to graffiti. 
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isMintKeyLoading ? (
          <div className="flex items-center justify-center h-20">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  id="mintKeyAddress"
                  name="mintKeyAddress"
                  placeholder="Enter new mint key address"
                  value={formData.mintKeyAddress}
                  onChange={handleInputChange}
                  className="text-white flex-grow"
                />
                <Button
                  type="submit"
                  disabled={!isFormChanged || isMining || isLoading}
                  className="whitespace-nowrap"
                >
                  {(isMining || isLoading) ? (
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                  ) : null}
                  Update
                </Button>
              </div>
              {errors.mintKeyAddress && <p className="text-red-500 text-sm mt-1">{errors.mintKeyAddress[0]}</p>}
            </div>
            {isSuccessMessageVisible && <p className="text-green-700">Mint key address has been updated!</p>}
          </form>
        )}
      </CardContent>
    </Card>
  )
}