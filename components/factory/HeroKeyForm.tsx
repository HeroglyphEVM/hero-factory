import { useState } from 'react';
import { Rocket } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { HeroKeyFormType } from './factory-types';
import { Switch } from '../ui/switch';
import { ImageUploader } from './ImageUploader';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

type FormErrors = {
  [K in keyof HeroKeyFormType]?: string;
};

const errorMessages: {
  [K in keyof HeroKeyFormType]: (value: string, maxSupply?: string) => string;
} = {
  type: value => (value.trim() == 'key' ? '' : 'Type must be key'),
  isPro: value => (value.trim() ? '' : 'Type must be key'),
  keyName: value =>
    !value.trim()
      ? 'Key name is required'
      : value.length > 24
      ? 'Key name must be less than 25 characters'
      : '',
  symbol: value => (!value.trim() ? 'Symbol is required' : ''),
  maxSupply: value =>
    !value || isNaN(Number(value)) || Number(value) <= 0
      ? 'Max supply must be a positive number'
      : '',

  paymentToken: value => (/^0x[a-fA-F0-9]{40}$/.test(value) ? '' : 'Invalid Ethereum address'),
  baseCost: value =>
    !value || isNaN(Number(value)) || Number(value) < 0
      ? 'Base cost must be a non-negative number'
      : '',
  costIncrement: value =>
    !value || isNaN(Number(value)) || Number(value) < 0
      ? 'Cost increment must be a non-negative number'
      : '',
  lzGasLimit: value =>
    !value || isNaN(Number(value)) || Number(value) <= 0
      ? 'LayerZero gas limit must be a positive number'
      : '',
  treasury: value => (/^0x[a-fA-F0-9]{40}$/.test(value) ? '' : 'Invalid Ethereum address'),
  feePayer: value => (/^0x[a-fA-F0-9]{40}$/.test(value) ? '' : 'Invalid Ethereum address'),
  owner: value => (/^0x[a-fA-F0-9]{40}$/.test(value) ? '' : 'Invalid Ethereum address'),
  image: value => (value ? '' : 'Image is required'),
};

export const HeroKeyForm = ({
  onFormSubmit,
}: {
  onFormSubmit: (formData: HeroKeyFormType) => void;
}) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [formData, setFormData] = useState<HeroKeyFormType>({
    type: 'key',
    isPro: false,
    keyName: '',
    symbol: '',
    maxSupply: '',
    paymentToken: '',
    baseCost: '',
    costIncrement: '',
    lzGasLimit: '',
    treasury: '',
    feePayer: '',
    owner: '',
    image: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id as keyof HeroKeyFormType]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    Object.keys(formData).forEach(key => {
      const typedKey = key as keyof HeroKeyFormType;
      const value = formData[typedKey];
      const errorFunction = errorMessages[typedKey];
      if (
        errorFunction &&
        (formData.isPro ||
          ![
            'paymentToken',
            'baseCost',
            'costIncrement',
            'lzGasLimit',
            'treasury',
            'feePayer',
            'owner',
          ].includes(typedKey))
      ) {
        const errorMessage = errorFunction(
          typeof value === 'string' ? value : String(value),
          formData.maxSupply,
        );
        if (errorMessage) {
          newErrors[typedKey] = errorMessage;
          isValid = false;
        }
      }
    });

    if (!formData.image) {
      newErrors.image = 'Image is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setErrors(prev => ({ ...prev, image: undefined }));
    }
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleCreate = () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    if (validateForm()) {
      onFormSubmit(formData);
      // setIsPreviewOpen(true)
    }
  };

  const renderInput = (
    id: keyof HeroKeyFormType,
    label: string,
    placeholder: string,
    type = 'text',
  ) => (
    <div>
      <Label htmlFor={id} className="text-white font-bold">
        {label}
      </Label>
      <div className={`flex items-center ${errors[id] ? 'border border-red-500 rounded-md' : ''}`}>
        {id === 'symbol' && <span className="pl-3 pr-2 text-gray-500">$</span>}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={formData[id]?.toString() ?? ''}
          onChange={handleInputChange}
          className={`flex-grow ${errors[id] ? 'border-0' : ''}`}
        />
      </div>
      {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id]}</p>}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row justify-between items-center">
            HeroKey (ERC721)
            <div className="flex justify-end items-center">
              <div className="flex items-center space-x-2 text-xs">
                <span>Pro</span>
                <Switch
                  checked={formData.isPro}
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, isPro: checked }))}
                />
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renderInput('keyName', 'Key Name', 'Enter your key name')}
          {renderInput('symbol', 'Symbol', 'Enter your token symbol')}
          {renderInput('maxSupply', 'Max Keys', 'Enter max number of keys', 'number')}

          {formData.isPro && (
            <>
              {renderInput('paymentToken', 'Payment Token', 'Enter payment token address')}
              {renderInput('baseCost', 'Base Cost', 'Enter base cost', 'number')}
              {renderInput('costIncrement', 'Cost Increment', 'Enter cost increment', 'number')}
              {renderInput('lzGasLimit', 'LZ Gas Limit', 'Enter LZ gas limit', 'number')}
              {renderInput('treasury', 'Treasury', 'Enter treasury address')}
              {renderInput('feePayer', 'Fee Payer', 'Enter fee payer address')}
              {renderInput('owner', 'Owner', 'Enter owner address')}
            </>
          )}
          <ImageUploader onChange={handleImageChange} />
          {errors['image'] && <p className="text-red-500 text-sm mt-1">{errors['image']}</p>}

          <Button onClick={handleCreate} className="w-full bg-muted hover:bg-muted/60 ">
            <Rocket className="mr-2 h-4 w-4 " />{' '}
            <span className="text-yellow-500 font-bold">Create Key</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
