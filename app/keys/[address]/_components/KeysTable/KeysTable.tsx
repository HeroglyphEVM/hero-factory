/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { KeyData } from '@/types/key-types';
import { useGetRecentKeyMints } from '@/hooks/keys/useGetRecentKeyMints';
import { KeysTableSkeleton } from './KeysTableSkeleton';
import { KeyItem } from './KeyItem';

export function KeysTable({ keyData }: { keyData: KeyData }) {
  const { data: keys, isLoading } = useGetRecentKeyMints(keyData);

  if (isLoading) {
    return <KeysTableSkeleton />;
  }

  if (!keys || keys.length === 0) {
    return <NoKeysFound />;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-6">
      {keys?.map(key => (
        <KeyItem key={key.tokenId} item={key} />
      ))}
    </div>
  );
}

const NoKeysFound = () => {
  return (
    <div className="text-center mb-6">
      <p className="text-muted-foreground text-lg font-bold mb-2">No recent mints</p>
      <p className="text-muted-foreground">
        There are currently no minted keys in the last 72 hours.
      </p>
    </div>
  );
};
