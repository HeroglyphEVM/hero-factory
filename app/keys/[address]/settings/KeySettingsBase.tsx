/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader } from "lucide-react"
import { z } from "zod"
import { KeyData } from "@/types/key-types"
import { Address, parseAbi } from "viem"
import { useContractWrite } from "@/hooks/useContractWrite"
import { useContractQuery } from "@/hooks/useContractQuery"

interface KeySettingsFormProps {
  keyData: KeyData
}

const KEY_CONTRACT_ABI = [
  "function setBaseURI(string memory _newBaseURI)",
  "function baseURI() view returns (string)",
]

const formSchema = z.object({
  baseURI: z.string().optional(),
})

export const KeySettingsBase: React.FC<KeySettingsFormProps> = ({ keyData }) => {
  const { data: contractBaseURI, isLoading: isBaseURILoading } = useContractQuery({
    contractAddress: keyData.address as Address,
    abi: parseAbi(KEY_CONTRACT_ABI),
    functionName: "baseURI",
  })

  const [formData, setFormData] = useState({ baseURI: "" })
  const [initialFormData, setInitialFormData] = useState({ baseURI: "" })
  const [errors, setErrors] = useState<Partial<z.inferFlattenedErrors<typeof formSchema>["fieldErrors"]>>({})
  const [isFormChanged, setIsFormChanged] = useState(false)
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { writeContractAsync, isMining, isSuccess } = useContractWrite({
    contractAddress: keyData.address as Address,
    abi: parseAbi(KEY_CONTRACT_ABI),
  })

  useEffect(() => {
    if (contractBaseURI) {
      setFormData({ baseURI: contractBaseURI })
      setInitialFormData({ baseURI: contractBaseURI })
    }
  }, [contractBaseURI])

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
        functionName: "setBaseURI",
        args: [formData.baseURI || ""]
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

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Update Base URI</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                id="baseURI"
                name="baseURI"
                placeholder="Empty string will reset to default"
                value={formData.baseURI}
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
            {errors.baseURI && <p className="text-red-500 text-sm mt-1">{errors.baseURI[0]}</p>}
          </div>
          {isSuccessMessageVisible && <p className="text-green-700">Base URI has been updated!</p>}
        </form>
      </CardContent>
    </Card>
  )
}