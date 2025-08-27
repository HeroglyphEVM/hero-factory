import appConfig from '@/app.config';
import { TARGET_NETWORK } from '@/services/web3/wagmiConfig';
import { QueryObserverBaseResult, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Abi, AbiStateMutability, ContractFunctionArgs, ContractFunctionName, Hex } from 'viem';
import { baseSepolia } from 'viem/chains';
import { useBlockNumber, useReadContract } from 'wagmi';

export type TQueryContractParams = {
  contractAddress: Hex;
  functionName: string;
  args?: ContractFunctionArgs<Abi, AbiStateMutability, ContractFunctionName>;
  abi: Abi;
  watch?: boolean;
};

export const useContractQuery = ({ contractAddress, functionName, args, abi, watch }: TQueryContractParams) => {
  const readContractHookRes = useReadContract({
    // chainId: baseSepolia.id,
    abi,
    functionName,
    address: contractAddress,
    args,
    query: {
      enabled: !Array.isArray(args) || !args.some(arg => arg === undefined),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 mins
      retry: 1,
    },
  });

  const defaultWatch = watch ?? true;
  const { data: blockNumber } = useBlockNumber({
    watch: defaultWatch,
    chainId: TARGET_NETWORK.id,
    query: {
      enabled: defaultWatch,
    },
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (defaultWatch) {
      queryClient.invalidateQueries({ queryKey: readContractHookRes.queryKey });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  return readContractHookRes as QueryObserverBaseResult<any>;
};
