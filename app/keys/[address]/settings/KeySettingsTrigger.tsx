/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  "function setTrigger(address _trigger)",
  "function trigger() view returns (address)",
]

const formSchema = z.object({
  triggerAddress: z.string().refine(isAddress, "Invalid Ethereum address"),
})

export const KeySettingsTrigger: React.FC<KeySettingsFormProps> = ({ keyData }) => {
  const { data: currentTriggerAddress, isLoading: isTriggerLoading } = useContractQuery({
    contractAddress: keyData.address as Address,
    abi: parseAbi(KEY_CONTRACT_ABI),
    functionName: "trigger",
  })

  const [formData, setFormData] = useState({ triggerAddress: "" })
  const [initialFormData, setInitialFormData] = useState({ triggerAddress: "" })
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
        functionName: "setTrigger",
        args: [formData.triggerAddress as Address]
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
    if (currentTriggerAddress) {
      setFormData({ triggerAddress: currentTriggerAddress })
      setInitialFormData({ triggerAddress: currentTriggerAddress })
    }
  }, [currentTriggerAddress])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Update Trigger Address</CardTitle>
      </CardHeader>
      <CardContent>
        {isTriggerLoading ? (
          <div className="flex items-center justify-center h-20">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  id="triggerAddress"
                  name="triggerAddress"
                  placeholder="Enter new trigger contract address"
                  value={formData.triggerAddress}
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
              {errors.triggerAddress && <p className="text-red-500 text-sm mt-1">{errors.triggerAddress[0]}</p>}
            </div>
            {isSuccessMessageVisible && <p className="text-green-700">Trigger address has been updated!</p>}
          </form>
        )}
      </CardContent>
    </Card>
  )
}