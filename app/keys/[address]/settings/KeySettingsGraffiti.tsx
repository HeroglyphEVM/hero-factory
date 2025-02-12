/* eslint-disable @next/next/no-img-element */
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader } from "lucide-react"
import { z } from "zod"
import { KeyData } from "@/types/key-types"
import { Address, isAddress } from "viem"
import { useContractWrite } from "@/hooks/useContractWrite"
import { MOCK_RELAY_ADDRESS } from "@/services/web3/constants"
import { parseAbi } from "viem"
interface KeySettingsFormProps {
  keyData: KeyData
}

const MOCK_RELAY_ABI = [
  "function triggerGraffiti(address _validatorWithdrawer, address _operatorContract)",
]


const formSchema = z.object({
  validatorWithdrawer: z.string().refine(isAddress, "Invalid Ethereum address"),
})

export const KeySettingsGraffiti: React.FC<KeySettingsFormProps> = ({ keyData }) => {
  const [validatorWithdrawer, setValidatorWithdrawer] = useState("")
  const [errors, setErrors] = useState<Partial<z.inferFlattenedErrors<typeof formSchema>["fieldErrors"]>>({})

  const { writeContractAsync: triggerGraffiti, isMining } = useContractWrite({
    contractAddress: MOCK_RELAY_ADDRESS,
    abi: parseAbi(MOCK_RELAY_ABI),
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidatorWithdrawer(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      formSchema.parse({ validatorWithdrawer })
      await triggerGraffiti({
        functionName: "triggerGraffiti",
        args: [validatorWithdrawer, keyData.address]
      })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors)
      } else {
        console.error("Error:", error)
      }
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Trigger Graffiti</CardTitle>
        <CardDescription>
          Only for testing. This will trigger a graffiti on the key contract.
        </CardDescription>
      </CardHeader>


      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                id="validatorWithdrawer"
                name="validatorWithdrawer"
                placeholder="Enter validator withdrawer address"
                value={validatorWithdrawer}
                onChange={handleInputChange}
                className="text-white flex-grow"
              />
              <Button
                type="submit"
                disabled={isMining}
                className="whitespace-nowrap"
              >
                {isMining ? (
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                Graffiti
              </Button>
            </div>
            {errors.validatorWithdrawer && <p className="text-red-500 text-sm mt-1">{errors.validatorWithdrawer[0]}</p>}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}