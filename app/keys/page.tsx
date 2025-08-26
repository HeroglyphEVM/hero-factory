'use client';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetFactoryKeys } from '@/hooks/factory/useGetFactoryKeys';
import { KeyTable } from './_components/KeyTable';
import { KeyTableSkeleton } from './_components/KeyTableSkeleton';

export default function Keys() {
  const [activeTab, setActiveTab] = useState('all');
  const { keys, myKeys, isLoading } = useGetFactoryKeys();
  console.log('Keys ', keys);
  return (
    <div className="py-5 px-2 mt-5 pb-16 md:pb-5">
      <main className="flex-grow p-4 overflow-auto">
        <div className="bg-primary border-2 border-border shadow-md">
          <Tabs defaultValue="all" className="p-4" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="all">All Keys</TabsTrigger>
              <TabsTrigger value="my">My Keys</TabsTrigger>
            </TabsList>
            <TabsContent value="all">{isLoading ? <KeyTableSkeleton /> : <KeyTable keys={keys} />}</TabsContent>
            <TabsContent value="my">{isLoading ? <KeyTableSkeleton /> : <KeyTable keys={myKeys} />}</TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
