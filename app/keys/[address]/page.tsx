'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { beautifyAddress } from '@/utils/web3';
import { useParams } from 'next/navigation';
import { useGetKeyMetadata } from '@/hooks/keys/useGetKeyMetadata';
import { Address } from 'viem';
import { KeyPageSkeleton } from '../_components/KeyPageSkeleton';
import { InvalidKey } from '../_components/InvalidKey';
import { KeyHeader } from './_components/KeyHeader';
import { useGetKeyDescriptor } from '@/hooks/keys/useGetKeyDescriptor';
import { CopyButton } from '@/components/ui/copy-button';
import { RecentMintsCard } from './_components/RecentMintsCard';
import { RecentKeyTransfersCard } from './_components/RecentKeyTransfersCard';

export default function KeyPage() {
  const { address } = useParams() as { address: Address };
  const { data: keyData, isLoading, isError } = useGetKeyMetadata(address);
  const { data: keyDescriptor } = useGetKeyDescriptor(keyData?.metadata?.descriptorHash);

  if (isLoading && !isError) {
    return <KeyPageSkeleton />;
  }

  if (!keyData || isError) {
    return <InvalidKey />;
  }

  return (
    <div className="container mx-auto px-4 py-8 mb-12">
      <KeyHeader keyData={keyData} keyDescriptor={keyDescriptor} />
      <div className="flex flex-col space-y-6">
        <div className="grid gap-6 md:grid-cols-2 ">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Key Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-6 text-muted-foreground">
                <div className="flex justify-between ">
                  <dt>Contract Address</dt>
                  <div className="flex items-center gap-2">
                    <span>{beautifyAddress(keyData.address)}</span>
                    <p className="icon cursor-pointer text-yellow-500">
                      <CopyButton value={keyData.address} />
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <dt>Owner</dt>
                  <div className="flex items-center gap-2">
                    <span>{beautifyAddress(keyData.owner)}</span>
                    <p className="icon cursor-pointer text-yellow-500">
                      <CopyButton value={keyData.owner} />
                    </p>
                  </div>
                </div>

                {keyDescriptor?.description && (
                  <div>
                    <dt className="mb-1 text-yellow-500">Description</dt>
                    <dd className="text-muted-foreground mb-1">
                      {keyDescriptor.description.length > 200
                        ? `${keyDescriptor.description.slice(0, 200)}...`
                        : keyDescriptor.description}
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
                  <dd>
                    {keyData.totalSupply} {keyData.symbol}
                  </dd>
                </div>
                <div className="flex justify-between ">
                  <dt>Max Supply</dt>
                  <dd>
                    {keyData.maxSupply} {keyData.symbol}
                  </dd>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <p className="text-sm font-medium">Rewards:</p>
                  </div>
                  <Progress
                    value={(Number(keyData.totalSupply) / Number(keyData.maxSupply)) * 100}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>
                      {((Number(keyData.totalSupply) / Number(keyData.maxSupply)) * 100).toFixed(2)}
                      %
                    </span>
                  </div>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
        <RecentMintsCard keyData={keyData} />
        <RecentKeyTransfersCard keyData={keyData} />
      </div>
    </div>
  );
}
