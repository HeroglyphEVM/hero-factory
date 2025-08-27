import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, Key } from 'lucide-react';
import { HeroTokenForm } from '@/components/factory/HeroTokenForm';
import { HeroKeyForm } from '@/components/factory/HeroKeyForm';
import { TokenPreviewDialog } from './TokenPreviewDialog';
import { KeyPreviewDialog } from './KeyPreviewDialog';
import { TokenCreatedDialog } from './TokenCreatedDialog';
import { KeyCreatedDialog } from './KeyCreatedDialog';
import { TokenFormData, KeyFormData } from './factory-types';

export const TokenFactory = () => {
  const [activeTab, setActiveTab] = useState('regular');
  const [isTokenCreated, setIsTokenCreated] = useState<boolean>(false);
  const [isKeyCreated, setIsKeyCreated] = useState<boolean>(false);
  const [isKeyPreviewOpen, setIsKeyPreviewOpen] = useState<boolean>(false);
  const [isTokenPreviewOpen, setIsTokenPreviewOpen] = useState<boolean>(false);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [tokenFormData, setTokenFormData] = useState<TokenFormData>();
  const [keyFormData, setKeyFormData] = useState<KeyFormData>();

  const handleTokenFormSubmit = (formData: TokenFormData) => {
    setTokenFormData(formData);
    setIsTokenPreviewOpen(true);
    setIsKeyPreviewOpen(false);
  };
  const handleKeyFormSubmit = (formData: KeyFormData) => {
    setKeyFormData(formData);
    setIsKeyPreviewOpen(true);
    setIsTokenPreviewOpen(false);
  };
  const handleTokenCreated = (address: string) => {
    setIsTokenCreated(true);
    setContractAddress(address);
  };
  const handleKeyCreated = (address: string) => {
    setIsKeyCreated(true);
    setContractAddress(address);
  };
  const handleCloseReviewDialog = () => {
    if (isTokenPreviewOpen) {
      setIsTokenPreviewOpen(false);
    }
    if (isKeyPreviewOpen) {
      setIsKeyPreviewOpen(false);
    }
  };
  const handleCloseTokenCreatedDialog = () => {
    setIsTokenCreated(false);
  };

  const handleCloseKeyCreatedDialog = () => {
    setIsKeyCreated(false);
  };

  return (
    <div className="p-2 w-full max-w-3xl mx-auto">
      <Tabs
        defaultValue="regular"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger
            value="regular"
            className="flex flex-col items-center justify-center space-y-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Coins className="w-8 h-8" />
            <span className="text-lg font-medium">New Token</span>
          </TabsTrigger>
          <TabsTrigger
            value="key"
            className="flex flex-col items-center justify-center space-y-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Key className="w-8 h-8" />
            <span className="text-lg font-medium">New Key</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="regular">
          <HeroTokenForm onFormSubmit={handleTokenFormSubmit} />
        </TabsContent>
        <TabsContent value="key">
          <HeroKeyForm onFormSubmit={handleKeyFormSubmit} />
        </TabsContent>
      </Tabs>
      {tokenFormData && !isTokenCreated && (
        <TokenPreviewDialog
          formData={tokenFormData}
          isOpen={isTokenPreviewOpen}
          onClose={handleCloseReviewDialog}
          onTokenCreated={handleTokenCreated}
        />
      )}
      {keyFormData && keyFormData.keyName && !isKeyCreated && (
        <KeyPreviewDialog
          formData={keyFormData}
          isOpen={isKeyPreviewOpen}
          onClose={handleCloseReviewDialog}
          onKeyCreated={handleKeyCreated}
        />
      )}
      {tokenFormData && (
        <TokenCreatedDialog
          isOpen={isTokenCreated}
          onClose={handleCloseTokenCreatedDialog}
          symbol={tokenFormData.symbol}
          coinName={tokenFormData.coinName}
          tokenAddress={contractAddress}
          image={tokenFormData.image}
        />
      )}
      {keyFormData && (
        <KeyCreatedDialog
          isOpen={isKeyCreated}
          onClose={handleCloseKeyCreatedDialog}
          symbol={keyFormData.symbol}
          keyName={keyFormData.keyName}
          keyAddress={contractAddress}
          image={keyFormData.image}
        />
      )}
    </div>
  );
};
