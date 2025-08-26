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
  const [isCreated, setIsCreated] = useState(false);
  // const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isKeyPreviewOpen, setIsKeyPreviewOpen] = useState(false);
  const [isTokenPreviewOpen, setIsTokenPreviewOpen] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
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
    setIsCreated(true);
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
    setIsCreated(false);
  };

  return (
    <div className="p-2 w-full max-w-3xl mx-auto">
      <Tabs defaultValue="regular" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
      {tokenFormData && (
        <TokenPreviewDialog
          formData={tokenFormData}
          isOpen={isTokenPreviewOpen}
          onClose={handleCloseReviewDialog}
          onTokenCreated={handleTokenCreated}
        />
      )}
      {keyFormData && keyFormData.keyName && (
        <KeyPreviewDialog
          formData={keyFormData}
          isOpen={isKeyPreviewOpen}
          onClose={handleCloseReviewDialog}
          onKeyCreated={handleTokenCreated}
        />
      )}
      {tokenFormData && (
        <TokenCreatedDialog
          isOpen={isCreated}
          onClose={handleCloseTokenCreatedDialog}
          symbol={tokenFormData.symbol}
          coinName={tokenFormData.coinName}
          tokenAddress={contractAddress}
          image={tokenFormData.image}
        />
      )}
      {keyFormData && (
        <KeyCreatedDialog
          isOpen={isCreated}
          onClose={handleCloseTokenCreatedDialog}
          symbol={keyFormData.symbol}
          keyName={keyFormData.keyName}
          keyAddress={contractAddress}
          image={keyFormData.image}
        />
      )}
    </div>
  );
};
