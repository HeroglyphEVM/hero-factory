import { KeyTransfer } from "@/types/key-types";
import { useQuery } from "@tanstack/react-query";
import { Address, Log, parseAbiItem } from "viem";
import { useAccount, usePublicClient } from "wagmi";

const ZERO_BIGINT = BigInt(0);

export const useGetRecentKeyTransfers = (tokenAddress: Address) => {
  const { address } = useAccount() as { address: Address };
  const client = usePublicClient();

  const fetchRecentTransfers = async (): Promise<KeyTransfer[]> => {

    const currentBlock = await client?.getBlockNumber();
    if (!currentBlock) return [];

    let logs: Log[] = [];
    let blockRange = 2000;
    const maxAttempts = 10;
    let attempts = 0

    while (logs.length < 10 && attempts < maxAttempts) {
      const fromBlock = currentBlock - BigInt(blockRange);
      
      logs = await client?.getLogs({
        address: tokenAddress,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
        fromBlock: fromBlock > ZERO_BIGINT ? fromBlock : ZERO_BIGINT,
        toBlock: 'latest'
      }) ?? [];

      blockRange *= 2;
      attempts++;
    }

    return logs
      .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
      .slice(0, 10)
      .map(parseTransfer);
  }

  return useQuery(
    {
      enabled: !!address,
      queryKey: ['transfers', tokenAddress],
      queryFn: fetchRecentTransfers,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
}

const parseTransfer = (log: any): KeyTransfer => {
  const { from, to, tokenId } = log.args;
  return {
    from,
    to,
    tokenId: Number(tokenId),
    blockNumber: Number(log.blockNumber),
    transactionHash: log.transactionHash
  }
}