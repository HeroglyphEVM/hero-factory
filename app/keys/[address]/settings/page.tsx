"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useGetKeyMetadata } from "@/hooks/keys/useGetKeyMetadata"
import { useParams } from "next/navigation"
import { Address } from "viem"
import { InvalidKey } from "../../_components/InvalidKey"
import { KeyPageSkeleton } from "../../_components/KeyPageSkeleton"
import { KeyHeader } from "../_components/KeyHeader"
import { useGetKeyDescriptor } from "@/hooks/keys/useGetKeyDescriptor"
import { KeySettingsForm } from "./KeySettingsForm"
import { KeySettingsBase } from "./KeySettingsBase"
import { KeySettingsTrigger } from "./KeySettingsTrigger"
import { KeySettingsGraffiti } from "./KeySettingsGraffiti"
import { KeySettingsMintKey } from "./KeySettingsMintKey"

export default function KeySettingsPage() {
  const { address } = useParams() as { address: Address };
  const { data: keyData, isLoading, isError } = useGetKeyMetadata(address);
  const { data: keyDescriptor } = useGetKeyDescriptor(keyData?.metadata?.descriptorHash);
  
  const [feePayer, setFeePayer] = useState("")

  if (isLoading && !isError) return <KeyPageSkeleton />
  if (!keyData || isError) return <InvalidKey />

  const handleFeePayerUpdate = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="container mx-auto px-4 py-8 mb-12">
      <KeyHeader keyData={keyData} keyDescriptor={keyDescriptor} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <KeySettingsForm keyData={keyData} keyDescriptor={keyDescriptor} />
        </div>
        
        <div className="space-y-6">
          <KeySettingsBase keyData={keyData} />
          <KeySettingsTrigger keyData={keyData} />
          <KeySettingsMintKey keyData={keyData} />
          <KeySettingsGraffiti keyData={keyData} />

        </div>
      </div>
    </div>
  )
}