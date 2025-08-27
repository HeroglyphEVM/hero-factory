import { TokenTransfer } from '@/types/token-types';
import { useQuery } from '@tanstack/react-query';
import { Address, formatUnits, Hex, Log, parseAbiItem } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

const ZERO_BIGINT = BigInt(0);

export const useGetRecentTransfers = (tokenAddress: Address) => {
  const { address } = useAccount() as { address: Address };
  const client = usePublicClient();

  const fetchRecentTransfers = async (): Promise<TokenTransfer[]> => {
    const currentBlock = await client?.getBlockNumber();
    if (!currentBlock) return [];

    let logs: Log[] = [];

    const maxAttempts = 10;
    let attempts = 0;

    const blockRange = 495;
    let fromBlock = currentBlock - BigInt(blockRange);
    let toBlock = currentBlock;

    while (logs.length < 10 && attempts < maxAttempts) {
      logs =
        (await client?.getLogs({
          address: tokenAddress,
          event: parseAbiItem(
            'event Transfer(address indexed from, address indexed to, uint256 value)',
          ),
          fromBlock: fromBlock > ZERO_BIGINT ? fromBlock : ZERO_BIGINT,
          toBlock: toBlock,
        })) ?? [];

      toBlock = fromBlock;
      fromBlock = fromBlock - BigInt(blockRange);
      attempts++;
    }

    return logs
      .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
      .slice(0, 10)
      .map(parseTransfer);
  };

  return useQuery({
    enabled: !!address,
    queryKey: ['transfers', tokenAddress],
    queryFn: fetchRecentTransfers,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

const parseTransfer = (log: any) => {
  const { from, to, value } = log.args;
  return {
    txHash: log.transactionHash,
    from,
    to,
    value: formatUnits(value, 18),
    blockNumber: Number(log.blockNumber),
    transactionHash: log.transactionHash,
  };
};
