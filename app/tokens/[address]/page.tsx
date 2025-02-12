"use client"

import { Copy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from '@/components/ui/progress'
import { beautifyAddress } from '@/utils/web3'
import { useParams } from 'next/navigation'
import { useGetTokenMetadata } from '@/hooks/tokens/useGetTokenMetadata'
import { Address } from 'viem'
import { TokenPageSkeleton } from '../_components/TokenPageSkeleton'
import { InvalidToken } from '../_components/InvalidToken'
import { TokenHeader } from './_components/TokenHeader'
import { useGetTokenDescriptor } from '@/hooks/tokens/useGetTokenDescriptor'
import { RecentTransfersCard } from './_components/RecentTransfersCard'
import { formatLargeNumber } from '@/lib/utils'; // Add this import
import { CopyButton } from "@/components/ui/copy-button"

export default function TokenPage() {
  const { address } = useParams() as { address: Address };
  const { data: tokenData, isLoading, isError } = useGetTokenMetadata(address)
  const { data: tokenDescriptor } = useGetTokenDescriptor(tokenData?.metadata?.descriptorHash);

  if (isLoading && !isError) {
    return <TokenPageSkeleton />
  }

  if (!tokenData || isError) {
    return <InvalidToken />
  }

  return (
    <div className="container mx-auto px-4 py-8 mb-12">
      <TokenHeader tokenData={tokenData} tokenDescriptor={tokenDescriptor} />
      <div className="grid gap-6 md:grid-cols-2 mb-6 ">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Token Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-6 text-muted-foreground">
              <div className="flex justify-between ">
                <dt>Contract Address</dt>
                <div className="flex items-center gap-2">
                  <span>{beautifyAddress(tokenData.address)}</span>
                  <p className="icon cursor-pointer text-yellow-500">
                    <CopyButton value={tokenData.address} />
                  </p>
                </div>
              </div>
              <div className='flex justify-between'>
                <dt>Owner</dt>
                <div className="flex items-center gap-2">
                  <span>{beautifyAddress(tokenData.owner)}</span>
                  <p className="icon cursor-pointer text-yellow-500">
                  <CopyButton value={tokenData.owner} />
                  </p>

                </div>
              </div>


              {tokenDescriptor?.description && (
                <div  >
                  <dt className="mb-1 text-yellow-500">Description</dt>
                  <dd className="text-muted-foreground mb-1">{tokenDescriptor.description.length > 200
                    ? `${tokenDescriptor.description.slice(0, 200)}...`
                    : tokenDescriptor.description}
                  </dd>
                </div>
              )}

            </dl>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Heroglyphs</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4 text-muted-foreground">

              <div className="flex justify-between">
                <dt>Current Supply</dt>
                <dd>{formatLargeNumber(tokenData.totalSupply)} {tokenData.symbol}</dd>
              </div>
              <div className="flex justify-between ">
                <dt>Max Supply</dt>
                <dd>{formatLargeNumber(tokenData.maxSupply)} {tokenData.symbol}</dd>
              </div>

              <div>
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <p className="text-sm font-medium">Rewards:</p>
                  <span>{tokenData.rewardPerBlock.toLocaleString()} / block graffiti</span>
                </div>
                <Progress value={(Number(tokenData.totalSupply) / Number(tokenData.maxSupply)) * 100} className="mt-2" />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Blocks Remaining: {Math.floor((Number(tokenData.maxSupply) - Number(tokenData.totalSupply)) / Number(tokenData.rewardPerBlock)).toLocaleString()}</span>
                  <span>{((Number(tokenData.totalSupply) / Number(tokenData.maxSupply)) * 100).toFixed(2)}%</span>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <RecentTransfersCard tokenData={tokenData} />
    </div>
  )
}
