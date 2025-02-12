"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useGetTokenMetadata } from "@/hooks/tokens/useGetTokenMetadata"
import { useParams } from "next/navigation"
import { Address } from "viem"
import { InvalidToken } from "../../_components/InvalidToken"
import { TokenPageSkeleton } from "../../_components/TokenPageSkeleton"
import { TokenHeader } from "../_components/TokenHeader"
import { useGetTokenDescriptor } from "@/hooks/tokens/useGetTokenDescriptor"
import { TokenSettingsForm } from "./TokenSettingsForm"
import { TokenSettingsTrigger } from "./TokenSettingsTrigger"
import { TokenSettingsMintKey } from "./TokenSettingsMintKey"
import { TokenSettingsGraffiti } from "./TokenSettingsGraffiti" 

export default function TokenSettingsPage() {
  const { address } = useParams() as { address: Address };
  const { data: tokenData, isLoading, isError } = useGetTokenMetadata(address);
  const { data: tokenDescriptor } = useGetTokenDescriptor(tokenData?.metadata?.descriptorHash);

  const [feePayer, setFeePayer] = useState("")

  if (isLoading && !isError) return <TokenPageSkeleton />
  if (!tokenData || isError) return <InvalidToken />

  const handleFeePayerUpdate = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="container mx-auto px-4 py-8 mb-12">
      <TokenHeader tokenData={tokenData} tokenDescriptor={tokenDescriptor} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div>
          <TokenSettingsForm tokenData={tokenData} tokenDescriptor={tokenDescriptor} />
        </div>
        
        <div className="">
          <TokenSettingsTrigger tokenData={tokenData} />
          <TokenSettingsMintKey tokenData={tokenData} />
          <TokenSettingsGraffiti tokenData={tokenData} />

        </div>
      </div>
    </div>
  )
}