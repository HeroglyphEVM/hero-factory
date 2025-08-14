"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetFactoryTokens } from "@/hooks/factory/useGetFactoryTokens";
import { TokenTable } from "./_components/TokenTable";
import { TokenTableSkeleton } from "./_components/TokenTableSkeleton";

export default function Tokens() {
  const [activeTab, setActiveTab] = useState("all");
  const { tokens, myTokens, isLoading } = useGetFactoryTokens();

  return (
    <div className="py-5 px-2 mt-5 pb-16 md:pb-5">
      <main className="flex-grow p-4 overflow-auto">
        <div className="bg-primary border-2 border-border shadow-md">
          <Tabs defaultValue="all" className="p-4" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="all">All Tokens</TabsTrigger>
              <TabsTrigger value="my">My Tokens</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {isLoading ? (
                <TokenTableSkeleton />
              ) : (
                <TokenTable tokens={tokens} />
              )}
            </TabsContent>
            <TabsContent value="my">
              {isLoading ? (
                <TokenTableSkeleton />
              ) : (
                <TokenTable tokens={myTokens} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
