import { useToast } from "@/hooks/use-toast";
import { wagmiConfig } from "@/services/web3/wagmiConfig";
import { getPublicClient } from "@wagmi/core";
import { Hash, SendTransactionParameters, TransactionReceipt, WalletClient } from "viem";
import { Config, useWalletClient } from "wagmi";
import { SendTransactionMutate } from "wagmi/query";
import { BaseError } from "viem";
import { truncateTxHash } from "@/utils/web3";

type TransactorFuncOptions = {
  onBlockConfirmation?: (txnReceipt: TransactionReceipt) => void;
  blockConfirmations?: number;
};

type TransactionFunc = (
  tx: (() => Promise<Hash>) | Parameters<SendTransactionMutate<Config, undefined>>[0],
  options?: TransactorFuncOptions,
) => Promise<Hash | undefined>;

const getParsedError = (e: any | BaseError): string => {
  let message = e.message ?? "An unknown error occurred";

  if (e instanceof BaseError) {
    if (e.details) {
      message = e.details;
    } else if (e.shortMessage) {
      message = e.shortMessage;
    } else if (e.message) {
      message = e.message;
    } else if (e.name) {
      message = e.name;
    }
  }

  return message;
};

export const useTransactor = (_walletClient?: WalletClient): TransactionFunc => {
  const { toast } = useToast()

  let walletClient = _walletClient;
  const { data } = useWalletClient();
  if (walletClient === undefined && data) {
    walletClient = data;
  }

  const result: TransactionFunc = async (tx, options) => {
    if (!walletClient) {
      return;
    }

    let transactionHash: Hash | undefined = undefined;
    try {
      const publicClient = getPublicClient(wagmiConfig);

      if (publicClient) {
        if (typeof tx === "function") {
          const result = await tx();
          transactionHash = result;
        } else if (tx != null) {
          transactionHash = await walletClient.sendTransaction(tx as SendTransactionParameters);
        } else {
          throw new Error("Incorrect transaction passed to transactor");
        }

        const transactionReceipt = await publicClient.waitForTransactionReceipt({
          hash: transactionHash,
          confirmations: options?.blockConfirmations,
        });

        toast({
          title: "Transaction Confirmed!",
          description: `${truncateTxHash(transactionHash)} has been confirmed`,
          duration: 2000,
        })

        if (options?.onBlockConfirmation) options.onBlockConfirmation(transactionReceipt);
      }
    } catch (error: any) {
      const message = getParsedError(error);
      toast({
        description: message,
        variant: "destructive",
      })
      throw error;
    }

    return transactionHash;
  };

  return result;
};
